<template>
    <section v-if="! authenticated" class="py-8 px-4">
        <div class="flex flex-wrap -mx-4">
            <div class="w-full px-4 mb-10">
                <h1 class="text-3xl">Import your wallet</h1>
            </div>

            <div class="w-full lg:w-1/2 px-4 mb-8 lg:mb-0">
                <div class="h-full flex flex-col p-8 pb-6 rounded shadow-md">
                    <h2 class="text-3xl font-semibold font-heading">Sign in </h2>
                    <p class="mb-2"> (Hedera Hashgraph account required)</p>

                    <form @submit.prevent="connectWallet">
                        <p
                            v-show="isOperatorInvalid"
                            class="my-4 bg-red-100 py-2 rounded text-sm text-red-600 text-center"
                        >
                            Your credentials are wrong. please check and try again.
                        </p>

                        <form-input
                            v-model="form.account_id"
                            label="Account id*"
                            required
                        />

                        <form-input
                            v-model="form.private_key"
                            label="Private key*"
                            required
                        />

                        <form-input
                            v-model="form.name"
                            label="Full Name*"
                            required
                        />

                        <form-select
                          v-model="form.network"
                          :options="options"
                          label="Network*"
                        />

                        <button-primary
                            type="submit"
                            :is-busy="isLoading"
                        >
                            Connect Hedera Hashgraph account via Private key import
                        </button-primary>
                    </form>
                </div>
            </div>
            <div class="w-full lg:w-1/2">
                <img
                    src="https://media.publit.io/file/Web-1280-1-z.png"
                    width="300"
                    style="margin-left: auto;margin-right: auto;"
                >
            </div>
        </div>
    </section>

    <section v-else class="py-12 px-4">
        <h2 class="text-4xl text-center mb-4 font-semibold font-heading">Welcome</h2>
        <p class="max-w-2xl mb-8 mx-auto text-center text-gray-400 leading-relaxed">
            Connected as <strong>{{ user.account_id }}</strong> Hedera Hashgraph account
        </p>

        <div class="rounded bg-green-600 hover:bg-green-500 text-white pt-2 flex max-w-lg mb-4 mx-auto text-center border-b-2 border-green-600">
            <div class=" w-3/3 pb-2 " style=" margin-left: auto;margin-right: auto;">
                <a href="#" class="hover:text-gray-50">Start browsing NFT marketplace</a>
            </div>
        </div>

        <p class="text-center mb-4 ">or</p>
        <router-link :to="{name: 'NftCreate'}" class="rounded bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white pt-2 flex max-w-lg mb-12 mx-auto text-center border-b-2 border-indigo-600">
            <div class="w-3/3 pb-2" style=" margin-left: auto;margin-right: auto;">
                <span class="hover:text-gray-50">Create a New NFT to sell</span>
            </div>
        </router-link>
    </section>
</template>

<script>
import ButtonPrimary from "@/components/ui/button/ButtonPrimary"
import {testClientOperatorMatch} from "@/service/HederaService"
import FormSelect from "@/components/form/FormSelect"
import FormInput from "@/components/form/FormInput"
import {computed, reactive, ref, watch} from "vue"
import {useStore} from "vuex"
import axios from 'axios'

let options = [
  {
    text: 'Mainnet',
    value: 'mainnet'
  },
  {
    text: 'Testnet',
    value: 'testnet'
  }
]

export default {
    name: "ImportAccount",

    components: {FormSelect, FormInput, ButtonPrimary},

    setup() {
      let authenticated = computed(() => store.getters['user/authenticated'])
      let user = computed(() => store.getters['user/user'])
      let isOperatorInvalid = ref(false)
      let isLoading = ref(false)
      let store = useStore()
      let form = reactive({
        account_id: '',
        private_key: '',
        name: '',
        network: 'mainnet'
      })

      async function connectWallet() {
        isOperatorInvalid.value = false
        isLoading.value = true

        if (! await testClientOperatorMatch(form)) {
          isOperatorInvalid.value = true
          isLoading.value = false
          return
        }

        await store.dispatch('user/setUser', form)

        isLoading.value = false
      }

      watch(() => [form.account_id], () => {
        axios.get(`https://api.wallet.xact.ac/api/profile/${form.account_id}`)
            .then(
                res => {
                  form.name = res.data.data.first_name + ' ' + res.data.data.last_name
                }
            )
      })

      return {
        isOperatorInvalid,
        authenticated,
        connectWallet,
        isLoading,
        options,
        user,
        form
      }
    }
}
</script>