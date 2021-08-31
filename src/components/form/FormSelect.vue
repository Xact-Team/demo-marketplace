<template>
  <div class="mb-6">
    <label v-if="label.length" class="block text-gray-700 text-sm font-bold mb-2">
      {{ label }}
    </label>

    <select
        :value="modelValue"
        @change="handleModelEvent"
        v-bind="$attrs"
        class="block w-full py-3 px-4 leading-tight text-gray-700 focus:bg-white border rounded focus:outline-none border-gray-200 focus:border-gray-500"
    >
      <option
          v-for="(option, index) in options"
          :key="index"
          :value="getOptionValue(option)"
      >
        {{ getOptionText(option) }}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: "FormSelect",

  props: {
    modelValue: {
      type: String
    },
    options: {
      type: [Array, Object]
    },
    error: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },

  inheritAttrs: false,

  emits: ['update:modelValue'],

  setup(_, {emit}) {
    function handleModelEvent(e) {
      emit('update:modelValue', e.target.value)
    }

    function getOptionText(option) {
      return typeof option === 'object'
          ? option.text
          : option
    }

    function getOptionValue(option) {
      return typeof option === 'object'
          ? option.value
          : option
    }

    return {
      handleModelEvent,
      getOptionValue,
      getOptionText
    }
  }
}
</script>