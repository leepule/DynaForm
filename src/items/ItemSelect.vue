<template>
  <el-select :value="computedValue" @input="handleInput" @change="handleChange" :placeholder="config.placeholder"
    :disabled="config.disabled" :clearable="config.clearable !== false" :multiple="config.multiple"
    :multiple-limit="config.limit" :collapse-tags="config.multiple" filterable :allow-create="config.allowCreate"
    reserve-keyword :size="size" :class="tagClass" :style="[tagStyle]">
    <el-option-group v-if="isGrouped" v-for="group in currentOptions" :key="group.label" :label="group.label">
      <el-option v-for="item in group.options" :key="getValue(item)" :label="getLabel(item)" :value="getValue(item)" />
    </el-option-group>
    <el-option v-if="!isGrouped" v-for="item in currentOptions" :key="getValue(item)" :label="getLabel(item)"
      :value="getValue(item)" />
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
      computedValue() {
        if (this.config.multiple) {
          if (typeof this.value === 'string' && this.value) {
            return this.value.split(',');
          }
          if (Array.isArray(this.value)) {
            return this.value;
          }
          return [];
        }
        return this.value;
      },
      hasGroups() {
        return this.options && this.options.length > 0 && (!!this.options[0].options || !!this.options[0].children);
      },
      isGrouped() {
        return this.hasGroups && this.options.length > 1;
      },
      currentOptions() {
        if (this.hasGroups && this.options.length === 1) {
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
      handleInput(val) {
        this.emitValue('input', val);
      },
      handleChange(val) {
        this.emitValue('change', val);
      },
      emitValue(eventName, val) {
        if (this.config.multiple) {
          const emitVal = Array.isArray(val) ? val.join(',') : (val || '');
          this.$emit(eventName, emitVal);
        } else {
          this.$emit(eventName, val);
        }
      },
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
  .el-select {
    width: 100%;
  }

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