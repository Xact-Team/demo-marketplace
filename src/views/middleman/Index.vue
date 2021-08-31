<template>
  <span v-if="errorMessage" class="my-3 text-red-600 text-center block text-lg">{{ errorMessage }}</span>
  <span v-if="showSuccessMessage" class="my-3 text-green-600 text-center block text-lg">
    NFT has been transferred to the buyer account.
    <br/>
    Hbar has been transferred to the seller account.
  </span>

  <h3 class="text-gray-800 mb-2 text-2xl font-semibold">Orders</h3>

  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Buyer id
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seller id
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction id
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token id
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hbar
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Edit</span>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(order, index) in orders" :key="order.id" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ order.buyer_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ order.nft.user_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.transaction_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.nft.token_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getPrice(order.nft).hbar }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ order.status }}
              </td>
              <td v-if="order.status === 'Pending'" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button-primary @click="handleOrderUpdate(order)" :is-busy="isLoading">Approve</button-primary>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonPrimary from "@/components/ui/button/ButtonPrimary"
import {transferToken} from "@/service/HederaService"
import {toSellerAccount} from "@/use/useHbarPayment"
import {computed, onMounted, ref} from "vue"
import useCurrency from "@/use/useCurrency"
import {useStore} from "vuex"
import axios from "axios"

export default {
  name: "Index",
  components: {ButtonPrimary},
  setup() {
    let store = useStore()
    let orders = ref({})
    let isLoading = ref(false)
    let {getPrice} = useCurrency()
    let errorMessage = ref('')
    let user = computed(() => store.getters['user/user'])
    let showSuccessMessage = ref(false)

    async function handleOrderUpdate(order) {
      isLoading.value = true
      errorMessage.value = ''
      showSuccessMessage.value = false

      try {
        await transferToken(order.nft.user_id, user.value, order.nft.token_id)

        axios.patch(`middleman/orders/${order.id}`, {
          secret: user.value.private_key,
          network: user.value.network
        }).then(
            async () => {
              await toSellerAccount(order.nft, user.value, getPrice(order.nft).hbar)
              showSuccessMessage.value = true
              isLoading.value = false
              orders.value.forEach(o => {
                if (o.id === order.id) {
                  o.status = 'Complete'
                }
              })
            }
        ).catch(
            err => {
              isLoading.value = false
              errorMessage.value = err.response.data.message
            }
        )
      } catch (err) {
        isLoading.value = false
        errorMessage.value = err.message
      }
    }

    onMounted(() => {
      axios.get('middleman/orders')
        .then(
            res => {
              orders.value = res.data.data
            }
        )
    })

    return {
      showSuccessMessage,
      handleOrderUpdate,
      errorMessage,
      isLoading,
      getPrice,
      orders
    }
  }
}
</script>