<template>
  <el-select
    :value="value"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    :placeholder="config.placeholder"
    :disabled="config.disabled"
    clearable
    :multiple="config.multiple"
    :multiple-limit="config.limit"
    :collapse-tags="config.multiple"
    filterable
    :allow-create="config.allowCreate"
    reserve-keyword
    :size="size"
    :class="tagClass"
    :style="tagStyle"
    style="width: 100%"
  >
    <!-- Grouped Options -->
    <el-option-group
      v-if="isGrouped"
      v-for="group in currentOptions"
      :key="group.label"
      :label="group.label"
    >
      <el-option
        v-for="item in group.options"
        :key="getValue(item)"
        :label="getLabel(item)"
        :value="getValue(item)"
      />
    </el-option-group>

    <!-- Flat Options (Normal or Single Group Flattened) -->
    <el-option
      v-if="!isGrouped"
      v-for="item in currentOptions"
      :key="getValue(item)"
      :label="getLabel(item)"
      :value="getValue(item)"
    />
  </el-select>
</template>

<script>
export default {
  name: 'ItemSelect',
  props: {
    value: {
      type: [String, Number, Array],
      default: null
    },
    config: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array,
      default: () => []
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  computed: {
    // Check if options have children/options field implying grouping
    hasGroups() {
      return this.options && this.options.length > 0 && (!!this.options[0].options || !!this.options[0].children);
    },
    // If multiple groups, use grouping. If 1 group, flatten it.
    isGrouped() {
      return this.hasGroups && this.options.length > 1;
    },
    currentOptions() {
      if (this.hasGroups && this.options.length === 1) {
        // Flatten single group
        return this.options[0].options || this.options[0].children || [];
      }
      return this.options;
    },
    tagClass() {
      return {
        'custom-tag-colors': !!this.config.tagColor || !!this.config.tagBackgroundColor,
        'has-text-color': !!this.config.tagColor,
        'has-bg-color': !!this.config.tagBackgroundColor
      };
    },
    tagStyle() {
      const style = {};
      if (this.config.tagColor) {
        style['--custom-tag-text-color'] = this.config.tagColor;
      }
      if (this.config.tagBackgroundColor) {
        style['--custom-tag-bg-color'] = this.config.tagBackgroundColor;
      }
      return style;
    }
  },
  methods: {
    getValue(item) {
      const field = this.config.valueField || 'value';
      return item[field];
    },
    getLabel(item) {
      const field = this.config.labelField || 'label';
      return item[field];
    }
  }
};
</script>

<style lang="scss" scoped>
/* Tags will now use default Element UI styles or global theme overrides */

/* Default Blue Theme (Restored) */
.el-select ::v-deep .el-tag {
  color: #409EFF;
  background-color: #ecf5ff;
  border-color: #d9ecff;

  .el-tag__close {
    color: #409EFF;
    background-color: #ecf5ff;

    &:hover {
      background-color: #409EFF;
      color: #FFF;
    }
  }
}

/* Custom Tag Colors Support */
.custom-tag-colors {
  &.has-text-color ::v-deep .el-tag {
    color: var(--custom-tag-text-color);

    .el-tag__close {
      color: var(--custom-tag-text-color);
      background-color: var(--custom-tag-bg-color);

      &:hover {
        background-color: var(--custom-tag-text-color);
        color: #fff;
      }
    }
  }

  &.has-bg-color ::v-deep .el-tag {
    background-color: var(--custom-tag-bg-color);
    border-color: var(--custom-tag-bg-color);
  }
}
</style>
