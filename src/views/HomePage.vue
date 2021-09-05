<template>
  <section class="py-12 px-4">
    <h2 class="text-4xl text-center mb-8 font-semibold font-heading">NFTs on sale</h2>
    <div class="flex flex-wrap -mx-4 -mb-8">
      <div v-if="isLoading">Loading...</div>

      <div
          v-else
          v-for="nft in nfts"
          :key="nft.id"
          class="w-full lg:w-1/4 px-4 mb-8"
      >
        <div class="relative rounded shadow">
          <router-link
              :to="{name: 'NftShow', params: {id: nft.id}}"
          >
            <asset-preview
                :asset="{
                  file: nft.asset,
                  type: nft.asset_type
                }"
            />
          </router-link>

          <div class="p-3">
            <h3 class="font-heading">
              <router-link
                  :to="{name: 'NftShow', params: {id: nft.id}}"
                  class="text-indigo-600"
              >
                {{ nft.name }}
              </router-link>
            </h3>
            <p class="text-sm pt-2 pb-2 text-gray-600">
              {{ nft.description }}
            </p>
            Buy for
            <nft-price :nft="nft" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AssetPreview from "@/components/AssetPreview"
import {computed, onMounted, ref} from "vue"
import NftPrice from "@/components/NftPrice"
import useCurrency from "@/use/useCurrency"
import {useStore} from "vuex"
import axios from "axios"

export default {
  name: "HomePage",

  components: {NftPrice, AssetPreview},

  setup() {
    let user = computed(() => store.getters['user/user'])
    let isLoading = ref(false)
    let {getPrice} = useCurrency()
    let nfts = ref({})
    let store = useStore()

    onMounted(() => {
      isLoading.value = true
      let network = user.value.network ? `?network=${user.value.network}` : ''

      axios.get(`/nft${network}`)
          .then(
              res => {
                isLoading.value = false
                nfts.value = res.data.data
              }
          )
    })

    return {
      isLoading,
      getPrice,
      nfts
    }
  }
}
</script>