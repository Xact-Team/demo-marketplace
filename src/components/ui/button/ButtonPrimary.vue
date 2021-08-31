<template>
    <button
        :disabled="isBusy"
        :class="{
            'bg-gray-500 cursor-not-allowed' : isBusy,
            'bg-indigo-600 hover:bg-indigo-700 shadow' : ! isBusy
        }"
        class="inline-block px-8 py-4 leading-none text-white text-center font-semibold rounded"
    >
        <PulseLoader
            :color="loader.color"
            :size="loader.size"
            v-show="isBusy"
        />
        <span v-show="! isBusy">
            <slot />
        </span>
    </button>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import {reactive} from "vue"

export default {
    name: "ButtonPrimary",

    props: {
        isBusy: {
            type: Boolean,
            default: false
        }
    },

    components: {
        PulseLoader
    },

    setup() {
        let loader = reactive({
            color: 'white',
            size: '9.3px'
        })

        return {
            loader
        }
    }
}
</script>
