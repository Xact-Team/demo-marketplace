<template>
  <span class="font-bold">{{ getPrice(nft).hbar }} HBAR </span>
  <span v-if="nft.fil_address">
    or
    <span class="font-bold">{{ getPrice(nft).fil }} FIL</span>
  </span>
</template>

<script>
import useCurrency from "@/use/useCurrency"

export default {
  name: "NftPrice",

  props: {
    nft: Object
  },

  setup() {
    let {getPrice} = useCurrency()

    return {
      getPrice
    }
  }
}
</script>