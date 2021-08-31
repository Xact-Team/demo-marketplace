<template>
  <label v-if="label.length" class="block text-gray-700 text-sm font-bold mb-2">{{ label }}</label>
  <div>
    <label
        v-for="(item, index) in items"
        :key="index"
        class="inline-flex items-center pb-5 pr-2"
    >
      <input
          :checked="modelValue === item"
          :value="item"
          @change="handleModelEvent(item)"
          v-bind="$attrs"
          type="radio"
          class="form-checkbox h-5 w-5 text-gray-600"
      >
      <span class="ml-2 text-gray-700">{{ item }}</span>
    </label>
  </div>
</template>

<script>
export default {
  name: "FormRadio",

  props: {
    modelValue: {
      type: String,
      default: ''
    },

    items: Array,

    label: {
      type: String,
      default: ''
    }
  },

  emits: ['update:modelValue'],

  setup(_, {emit}) {
    function handleModelEvent(item) {
      emit('update:modelValue', item)
    }

    return {
      handleModelEvent
    }
  }
}
</script>