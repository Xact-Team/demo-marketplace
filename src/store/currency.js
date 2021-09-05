import axios from "axios"

export default {
    namespaced: true,

    state: {
        currency: []
    },

    getters: {
        currency(state) {
            return state.currency
        }
    },

    mutations: {
        SET_CURRENCY(state, currency) {
            state.currency = currency
        }
    },

    actions: {
        getCurrency({commit, getters}) {
            if (Object.keys(getters.currency).length) return

            axios.get(`${process.env.VUE_APP_BACKEND_URI}/coingecko/get-usd-value-for`, {
                params: {
                    coin: 'filecoin,hedera-hashgraph'
                }
            }).then(
                ({data}) => {
                    commit('SET_CURRENCY', {
                        fil: data.filecoin.usd,
                        hbar: data['hedera-hashgraph'].usd
                    })
                }
            )
        }
    }
}