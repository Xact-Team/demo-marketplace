export default {
    namespaced: true,

    state: {
        user: [],
        authenticated: false
    },

    getters: {
        user(state) {
            return state.user
        },

        authenticated(state) {
            return state.authenticated
        }
    },

    mutations: {
        SET_USER(state, user) {
            let parsedUser = user ? JSON.parse(user) : {}
            state.user = parsedUser
            state.authenticated = !! Object.keys(parsedUser).length
        }
    },

    actions: {
        setUser({commit}, user) {
            let userParsed = JSON.stringify(user)
            localStorage.setItem('user', userParsed)
            commit('SET_USER', userParsed)
        },

        getUser({commit}) {
            let user = localStorage.getItem('user')
            commit('SET_USER', user)
        }
    }
}
