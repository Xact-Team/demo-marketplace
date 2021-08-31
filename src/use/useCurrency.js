import useCurrencyConverter from "@/composable/currencyConverter"

export default function useCurrency() {
    let {convertCurrency} = useCurrencyConverter()

    function getCorrespondentPrice(nft, currency) {
        return nft.currency === currency
            ? parseFloat(nft.price)
            : convertCurrency(nft.price, nft.currency).price
    }

    function getPrice(nft) {
        return {
            hbar: getCorrespondentPrice(nft, 'Hbar'),
            fil: getCorrespondentPrice(nft, 'FIL')
        }
    }

    return {
        getPrice
    }
}
