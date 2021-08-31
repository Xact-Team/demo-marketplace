<template>
  <div class="mb-6">
    <label
        v-show="label.length"
        class="block text-gray-700 text-sm font-bold mb-2"
    >
      {{ label }}
    </label>

    <input
        :value="modelValue"
        @input="handleInput"
        :class="{
          'border-red-200 focus:border-red-500' : error.length,
          'border-gray-200 focus:border-gray-500' : ! error.length,
          'bg-gray-100 cursor-not-allowed': disabled
        }"
        :disabled="disabled"
        v-bind="$attrs"
        class="appearance-none block w-full py-3 px-4 leading-tight text-gray-700 focus:bg-white border rounded focus:outline-none"
    >

    <span v-show="error.length" class="font-mono text-sm text-red-500">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: "FormInput",

  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },

    label: {
      type: String,
      default: ''
    },

    error: {
      type: String,
      default: ''
    },

    disabled: {
      type: Boolean,
      default: false
    }
  },

  inheritAttrs: false,

  emits: ['update:modelValue'],

  setup(_, {emit}) {
    function handleInput(e) {
      emit('update:modelValue', e.target.value)
    }

    return {
      handleInput
    }
  }
}
</script>
