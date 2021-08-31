<template>
  <section class="py-12">
    <div v-if="isNftLoading">Loading...</div>

    <div v-else>
      <div v-if="! nft.name">NFT not found.</div>

      <div v-else class="flex flex-wrap -mx-8">
        <div class="lg:w-1/2 px-8 mt-6 lg:mt-0 order-2 lg:order-none">
          <h2 class="text-4xl mb-2 font-semibold font-heading">{{ nft.name }}</h2>
          <p class="mb-6">{{ getPrice(nft).hbar }} HBAR or {{ getPrice(nft).fil }} FIL</p>
          <div class="flex mb-6">
            <ul class="flex list-reset">
              <li class="block py-2 px-3 mr-2 bg-gray-100 rounded">
                Product Details
              </li>
            </ul>
          </div>
          <p class="mb-8 text-gray-400 leading-relaxed">
            {{ nft.description }}
          </p>
          <table class="w-full mb-6">
            <tbody>
            <tr class="border-t">
              <td class="py-3">Total of copies</td>
              <td class="text-right">{{ nft.supply }}</td>
            </tr>
            <tr class="border-t">
              <td class="py-3">Price per copy</td>
              <td class="text-right">{{ getPrice(nft).hbar }} HBAR or {{ getPrice(nft).fil }} FIL</td>
            </tr>
            <tr class="border-t">
              <td class="py-3">Category</td>
              <td class="text-right">{{ nft.category }}</td>
            </tr>
            </tbody>
          </table>

          <div v-if="! showPurchaseCompleteMessage.length">
            <div class="flex items-center mb-4">
              <span class="text-yellow-600 uppercase">warning! &nbsp;</span>
              Before purchase this NFT, associate it with your account &nbsp;
              <strong>{{ nft.token_id }}</strong>
            </div>

            <div class="flex items-center space-x-4">
              <button-primary
                  @click="hbarCheckout"
                  :is-busy="isLoading"
              >
                Buy with HBAR!
              </button-primary>

              <button-primary
                  @click="filCheckout"
                  :is-busy="isLoading"
              >
                Buy with FIL!
              </button-primary>
            </div>
          </div>

          <div v-show="errorMessage" class="text-red-500 font-mono mt-2">
            {{ errorMessage }}
          </div>
          <div v-show="showPurchaseCompleteMessage" class="text-green-500 font-mono mt-2">
            {{ showPurchaseCompleteMessage }}
          </div>
        </div>
        <div class="lg:w-1/2 px-8">
          <asset-preview
              :asset="{
              file: nft.asset,
              type: nft.asset_type
            }"
              class="mb-4 rounded shadow"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ButtonPrimary from "@/components/ui/button/ButtonPrimary"
import {toCentralAccount} from "@/use/useHbarPayment"
import AssetPreview from "@/components/AssetPreview"
import useTrustWallet from "@/use/useTrustWallet"
import {computed, onMounted, ref} from "vue"
import useCurrency from "@/use/useCurrency"
import {useRoute} from "vue-router"
import {useStore} from "vuex"
import axios from "axios"

export default {
  name: "Show",

  components: {ButtonPrimary, AssetPreview},

  setup() {
    let user = computed(() => store.getters['user/user'])
    let showPurchaseCompleteMessage = ref('')
    let errorMessage = ref('')
    let isNftLoading = ref(true)
    let isLoading = ref(false)
    let {getPrice} = useCurrency()
    let nft = ref({})
    let store = useStore()
    let route = useRoute()

    onMounted(() => {
      isNftLoading.value = true

      axios.get(`nft/${route.params.id}`)
          .then(
              res => {
                nft.value = res.data.data
                isNftLoading.value = false
              }
          ).catch(() => isNftLoading.value = false)
    })

    async function filCheckout() {
      try {
        isLoading.value = true
        await useTrustWallet(nft)
        isLoading.value = false
      } catch (err) {
        isLoading.value = false
        errorMessage.value = err.message
      }
    }

    async function hbarCheckout() {
      try {
        isLoading.value = true

        let res = await toCentralAccount(nft.value, user.value, getPrice(nft.value).hbar)

        isLoading.value = false
        showPurchaseCompleteMessage.value = `Purchase complete. It might take few min to show up the NFT in your account. transaction id ${res.txId}`
        recordOrder(res.txId)
        nft.value.supply--
      } catch (err) {
        isLoading.value = false
        errorMessage.value = err.message
      }
    }

    function recordOrder(tx_id) {
      axios.post('orders', {
        nft_id: nft.value.id,
        buyer_id: user.value.account_id,
        tx_id
      })
    }

    return {
      showPurchaseCompleteMessage,
      errorMessage,
      hbarCheckout,
      isNftLoading,
      filCheckout,
      isLoading,
      getPrice,
      nft
    }
  }
}
</script>
