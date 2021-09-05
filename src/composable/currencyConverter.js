import {useStore} from "vuex"
import {computed, onMounted} from "vue"

export default function useCurrencyConverter() {
    let store = useStore()
    let currencyInUsd = computed(() => store.getters['currency/currency'])

    /**
     * If Hbar selected get Hbar equivalent of FIL.
     * @param price
     * @param currency
     * @returns {{price: string, currency: (string)}}
     */
    function convertCurrency(price, currency) {
        // calculate selected currency in USD value.
        let usdValue = currency === 'FIL'
            ? currencyInUsd.value.fil
            : currencyInUsd.value.hbar
        let calcUsd = format(usdValue * parseFloat(price))

        // Calculate unselected currency.
        let otherUsdValue = currency === 'FIL'
            ? currencyInUsd.value.hbar
            : currencyInUsd.value.fil

        return {
            price: format(calcUsd / otherUsdValue),
            currency: currency === 'FIL' ? 'Hbar' : 'FIL'
        }
    }

    onMounted(() => {
        store.dispatch('currency/getCurrency')
    })

    return {
        convertCurrency,
    }
}

function format(value) {
    return parseFloat(value).toFixed(8)
}
