import {onMounted, reactive} from "vue"
import axios from "axios"

export default function useCurrencyConverter() {
    let currencyInUsd = reactive({
        hbar: 0,
        fil: 0
    })

    /**
     * If Hbar selected get Hbar equivalent of FIL.
     * @param price
     * @param currency
     * @returns {{price: string, currency: (string)}}
     */
    function convertCurrency(price, currency) {
        // calculate selected currency in USD value.
        let usdValue = currency === 'FIL'
            ? currencyInUsd.fil
            : currencyInUsd.hbar
        let calcUsd = format(usdValue * parseFloat(price))

        // Calculate unselected currency.
        let otherUsdValue = currency === 'FIL'
            ? currencyInUsd.hbar
            : currencyInUsd.fil

        return {
            price: format(calcUsd / otherUsdValue),
            currency: currency === 'FIL' ? 'Hbar' : 'FIL'
        }
    }

    onMounted(() => {
        axios.get(`${process.env.VUE_APP_BACKEND_URI}/coingecko/get-usd-value-for`, {
            params: {
                coin: 'filecoin,hedera-hashgraph'
            }
        }).then(
            ({data}) => {
                currencyInUsd.fil = data.filecoin.usd
                currencyInUsd.hbar = data['hedera-hashgraph'].usd
            }
        )
    })

    return {
        convertCurrency,
    }
}

function format(value) {
    return parseFloat(value).toFixed(8)
}
