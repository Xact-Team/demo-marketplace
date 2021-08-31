<template>
  <div class="mb-6">
    <label v-if="label.length" class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>

    <textarea
        :value="modelValue"
        @input="handleModelEvent"
        v-bind="$attrs"
        class="appearance-none block w-full py-3 px-4 leading-tight text-gray-700 focus:bg-white border border-gray-200 focus:border-gray-500 rounded focus:outline-none"
        rows="3"
    ></textarea>
  </div>
</template>

<script>
export default {
  name: "FormTextarea",

  props: {
    modelValue: {
      type: String
    },
    label: {
      type: String,
      default: ''
    },
    error: {
      type: String,
      default:''
    }
  },

  inheritAttrs: false,

  emits: ['update:modelValue'],

  setup(_, {emit}) {
    function handleModelEvent(e) {
      emit('update:modelValue', e.target.value)
    }

    return {
      handleModelEvent
    }
  }
}
</script>