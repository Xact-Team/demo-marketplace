<template>
  <div class="container mx-auto px-4">
    <div>
      <layout-top-nav />

      <router-view/>

      <layout-footer />
    </div>
  </div>
</template>

<script>
import LayoutFooter from "@/layouts/LayoutFooter"
import LayoutTopNav from "@/layouts/LayoutTopNav"

export default {

  components: {LayoutTopNav, LayoutFooter}
}
</script>