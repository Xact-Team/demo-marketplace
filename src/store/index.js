import currency from '@/store/currency'
import {createStore} from 'vuex'
import user from '@/store/user'

export default createStore({
    modules: {
        currency,
        user
    }
})
