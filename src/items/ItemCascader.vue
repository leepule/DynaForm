<template>
  <el-cascader
    :value="value"
    @input="$emit('input', $event)"
    @change="$emit('change', $event)"
    :options="options"
    :props="cascaderProps"
    :placeholder="config.placeholder"
    :disabled="config.disabled"
    clearable
    :show-all-levels="config.showAllLevels"
    :size="size"
    :class="tagClass"
    :style="tagStyle"
    style="width: 100%"
  />
</template>

<script>
export default {
  name: 'ItemCascader',
  props: {
    value: {},
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
    cascaderProps() {
      return {
        multiple: this.config.multiple,
        checkStrictly: this.config.checkStrictly,
        value: this.config.valueField || 'value',
        label: this.config.labelField || 'label',
        children: this.config.childrenField || 'children',
        emitPath: false // Usually we want just the value, update if needed
      };
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
  }
};
</script>

<style lang="scss" scoped>
/* Default Blue Theme */
::v-deep .el-cascader__tags .el-tag {
  color: #409EFF;
  background-color: #ecf5ff;
  border-color: #d9ecff;

  .el-tag__close {
    color: #409EFF;
    background-color: #ecf5ff;

    &:hover {
      background-color: #409EFF;
      color: #fff;
    }
  }
}

/* Custom Tag Colors Support */
.custom-tag-colors {
  &.has-text-color ::v-deep .el-cascader__tags .el-tag {
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

  &.has-bg-color ::v-deep .el-cascader__tags .el-tag {
    background-color: var(--custom-tag-bg-color);
    border-color: var(--custom-tag-bg-color);
  }
}
</style>
