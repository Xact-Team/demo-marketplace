<template>
  <div>
    <div class="flex flex-wrap py-12 px-4-mx-4 pl-4 mb-5 md:mb-0">
      <div class="w-full md:w-1/2 mb-5 md:mb-0">
        <div class="pb-5">
          <h2 class="text-4xl mt-5  leading-tight font-semibold font-heading">Create a New NFT</h2>
          <p class="text-sm">Fields marked with a * are required</p>
        </div>

        <form @submit.prevent="handleNftCreation" action="#" method="post">
          <form-input
              v-model="form.name"
              label="Name for your NFT*"
              type="text"
              required
          />

          <form-textarea
            v-model="form.description"
            label="Description"
            placeholder="Write something..."
          />

          <div class="mb-6">
            <div class="flex space-x-4 -mb-4">
              <div class="flex-1">
                <form-input
                    v-model="form.price"
                    label="Price*"
                    type="number"
                    step="0.00000001"
                    min=0
                    required
                />
              </div>

              <div class="flex-1">
                <form-select
                  v-model="form.currency"
                  :options="currency"
                  label="Currency*"
                  required
                />
              </div>
            </div>

            <span class="font-mono text-sm">Price In {{ other.currency }} : {{ other.price }}</span>
          </div>

          <form-input
              v-model="form.supply"
              label="Supply*"
              type="number"
              min="1"
              required
          />

          <div class="mb-6">
            <form-radio
                v-model="form.category"
                :items="categories"
                label="Category*"
                name="category"
            />


            <form-input
              :placeholder="user.account_id"
              :disabled="true"
              label="Your Hedera Hashgraph Mainnet account id/address*"
            />

            <form-input
                v-model="form.fil_address"
                label="Your Filecoin account address"
                type="text"
            />

            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2">NFT file*</label>
              <label
                  class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-600 rounded-lg shadow-sm tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600 hover:text-white">
                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"></path>
                </svg>
                <span class="mt-2 text-base leading-normal">
                  Select a file (image, video, audio, file)
                </span>
                <input @change="handleFileSelected" type="file" class="hidden" required>
              </label>
            </div>

            <button-primary
                type="submit"
                :is-busy="isLoading"
            >
              Submit
            </button-primary>
          </div>
        </form>
      </div>

      <div class="mt-5 w-full md:w-1/2 px-4 mb-4 md:mb-0">
        <section class="py-8 px-4">
          <h4 class="text-2xl mb-2 leading-tight font-semibold font-heading">Preview</h4>
          <asset-preview class="rounded shadow mx-auto" :asset="preview"/>
        </section>
      </div>
    </div>
  </div>

  <nft-created-modal
    :open="nftCreated"
  >
    Transaction id: {{ transactionId }}
  </nft-created-modal>
</template>

<script>
import useCurrencyConverter from "@/composable/currencyConverter"
import ButtonPrimary from "@/components/ui/button/ButtonPrimary"
import NftCreatedModal from "@/components/NftCreatedModal"
import FormTextarea from "@/components/form/FormTextarea"
import createNftAction from "@/action/createNftAction"
import FormSelect from "@/components/form/FormSelect"
import AssetPreview from "@/components/AssetPreview"
import FormInput from "@/components/form/FormInput"
import FormRadio from "@/components/form/FormRadio"
import {computed, reactive, ref, watch} from "vue"
import buildFormData from "@/utils/helpers"
import {useStore} from "vuex"
import axios from "axios"

let categories = [
  'Art',
  'Digital Art',
  'Music',
  'Collectible',
  'Document',
  'Other'
]
let currency = ['Hbar', 'FIL']

export default {
  name: "Create",

  components: {
    NftCreatedModal,
    FormRadio,
    ButtonPrimary,
    FormTextarea,
    AssetPreview,
    FormSelect,
    FormInput
  },

  setup() {
    let user = computed(() => store.getters['user/user'])
    let {convertCurrency} = useCurrencyConverter()
    let transactionId = ref('')
    let isLoading = ref(false)
    let nftCreated = ref(false)
    let store = useStore()
    let preview = reactive({
      file: new Blob(),
      type: ''
    })
    let other = reactive({
      price: 0,
      currency: 'FIL'
    })
    let form = reactive({
      name: '',
      description: '',
      price: 0,
      currency: 'Hbar',
      supply: 1,
      category: 'Art',
      fil_address: '',
      asset: '',
      network: user.value.network,
      user_id: user.value.account_id
    })

    watch(() => [form.price, form.currency], val => {
      let {price, currency} = convertCurrency(val[0], val[1])
      other.price = price
      other.currency = currency
    })

    async function handleNftCreation() {
      isLoading.value = true

      let createdNft = await createNftAction(user, form)

      axios.post('nft', buildFormData({
        ...form,
        token_id: createdNft.tokenId
      }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'multipart/form-data'
        }
      }).then(
          () => {
            isLoading.value = false
            nftCreated.value = true
            transactionId.value = createdNft.txId
          }
      )
    }

    function handleFileSelected(e) {
      let file = e.target.files[0]
      form.asset = file

      preview.type = file.type
      preview.file = URL.createObjectURL(file)
    }

    return {
      handleFileSelected,
      handleNftCreation,
      convertCurrency,
      transactionId,
      categories,
      nftCreated,
      isLoading,
      currency,
      preview,
      other,
      user,
      form
    }
  }
}
</script>
