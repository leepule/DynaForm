<template>
  <div class="custom-form-item" :class="config.type"
  >
    <slot
      v-if="useSlot"
      :name="config.type"
      :config="config"
      :value="value"
      :options="options"
      :tableOptions="tableOptions"
      :size="size"
      :pageSize="pageSize"
    />
    <component
      v-else-if="currentComponent"
      :is="currentComponent"
      :value="value"
      @input="handleInput"
      @change="handleChange"
      v-on="$listeners"
      v-bind="$attrs"
      :config="config"
      :options="options"
      :tableOptions="tableOptions"
      :total="total"
      :pageSize="pageSize"
      :size="size"
    />
    <div v-else class="unknown-component">
      Unknown component type: {{ config.type }}
    </div>
  </div>
</template>

<script>
import ItemText from './items/ItemText.vue';
import ItemNumber from './items/ItemNumber.vue';
import ItemSelect from './items/ItemSelect.vue';
import ItemDatePicker from './items/ItemDatePicker.vue';
import ItemCascader from './items/ItemCascader.vue';
import ItemTreeSelectElement from './items/ItemTreeSelectElement.vue';
import ItemPersonPicker from './items/ItemPersonPicker.vue';
export default {
  name: 'DynaForm',
  components: {
    ItemText,
    ItemNumber,
    ItemSelect,
    ItemDatePicker,
    ItemCascader,
    ItemTreeSelectElement,
    ItemPersonPicker
  },
  props: {
    config: {
      type: Object,
      required: true
    },
    value: {
      required: false
    },
    options: {
      type: Array,
      default: () => []
    },
    tableOptions: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: 'mini'
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  computed: {
    useSlot() {
      // Removed personPicker from here to use the default component
      return [].includes(this.config.type);
    },
    currentComponent() {
      if (this.useSlot || !this.config) return null;
      const map = {
        text: 'ItemText',
        number: 'ItemNumber',
        numberbox: 'ItemNumber',
        select: 'ItemSelect',
        selectPicker: 'ItemSelect',
        date: 'ItemDatePicker',
        datePicker: 'ItemDatePicker',
        daterange: 'ItemDatePicker',
        dateRangePicker: 'ItemDatePicker',
        cascader: 'ItemCascader',
        cascaderPicker: 'ItemCascader',
        selecttree: 'ItemTreeSelectElement',
        selectTreePicker: 'ItemTreeSelectElement',
        deptPicker: 'ItemTreeSelectElement',
        personPicker: 'ItemPersonPicker',
        custom: 'ItemText'
      };
      return map[this.config.type] || map[this.config.componentId] || null;
    }
  },
  methods: {
    handleInput(val) {
      this.$emit('input', val);
    },
    handleChange(val) {
      this.$emit('change', val);
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-form-item {
  width: 100%;
}
</style>
