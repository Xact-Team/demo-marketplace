<template>
    <nav class="flex flex-wrap border-b-2 items-center justify-between p-4">
        <div class="flex flex-shrink-0">
            <router-link
                :to="{name: 'Home'}"
                class="text-xl text-indigo-600 font-semibold font-heading"
            >
                DemoApp Marketplace
            </router-link>
        </div>
        <div class="block lg:hidden">
            <button class="navbar-burger flex items-center py-2 px-3 text-indigo-500 rounded border border-indigo-500">
                <svg class="fill-current h-3 w-3" viewbox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
                </svg>
            </button>
        </div>
        <div class="navbar-menu hidden lg:flex lg:flex-grow lg:items-center w-full lg:w-auto">
            <div class="ml-auto lg:space-x-4">
                <router-link
                    :to="{name: 'Home'}"
                    class="block lg:inline-block mt-4 lg:mt-0 lg:mr-8 text-blue-900 hover:text-indigo-600"
                >
                    Marketplace
                </router-link>
                <router-link
                    v-if="! authenticated"
                    :to="{name: 'ImportAccount'}"
                    class="inline-block py-3 px-6 mt-4 lg:mt-0 leading-none text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow"
                >
                    Import Account
                </router-link>
                <router-link
                    v-if="authenticated"
                    :to="{name: 'NftCreate'}"
                    class="inline-block py-3 px-6 mt-4 lg:mt-0 leading-none text-white bg-indigo-600 hover:bg-indigo-700 font-semibold rounded shadow"
                >
                    Create a NFT
                </router-link>

                <span v-if="authenticated" class="inline-block py-3 px-6 mt-4 lg:mt-0 leading-none text-indigo-500 border-b-2 border-indigo-600 font-semibold rounded shadow">
                    Connected with Hedera Hashgraph account {{ user.account_id }}
                </span>
            </div>
        </div>
    </nav>
</template>

<script>
import {computed, onMounted} from "vue"
import {useStore} from "vuex"

export default {
  name: "LayoutTopNav",

  setup() {
    let user = computed(() => store.getters['user/user'])
    let authenticated = computed(() => store.getters['user/authenticated'])
    let store = useStore()

    onMounted(() => {
      store.dispatch('user/getUser')
    })

    return {
      authenticated,
      user
    }
  }
}
</script>
