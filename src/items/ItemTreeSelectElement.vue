<template>
  <el-select ref="select" :value="computedValue" :multiple="config.multiple" :multiple-limit="config.limit"
    :collapse-tags="config.multiple" :disabled="config.disabled" :placeholder="config.placeholder" :size="size"
    :clearable="config.clearable !== false" :filterable="true" :allow-create="config.allowCreate"
    :filter-method="handleFilter" popper-class="item-tree-select-popper" :class="tagClass" :style="[tagStyle]"
    @input="handleSelectInput" @clear="handleClear" @remove-tag="handleRemoveTag" @visible-change="handleVisibleChange">
    <el-option v-for="item in selectedNodes" :key="item[nodeKey]" :label="item[treeProps.label]" :value="item[nodeKey]"
      style="display: none" />
    <el-option :value="treeOptionValue" class="tree-option-item">
      <el-tree ref="tree" :data="options" :props="treeProps" :show-checkbox="config.multiple"
        :check-strictly="config.checkStrictly || config.disableBranchNodes" :node-key="nodeKey"
        :default-expand-all="false" :default-expanded-keys="defaultExpandedKeys" :expand-on-click-node="true"
        :highlight-current="!config.multiple" :class="{'hide-branch-checkbox': config.disableBranchNodes}"
        :filter-node-method="filterNode" @check="handleCheck" @node-click="handleNodeClick" />
    </el-option>
  </el-select>
</template>
<script>
  export default {
    name: 'ItemTreeSelectElement',
    props: {
      value: {
        required: true
      },
      config: {
        type: Object,
        default: () => ({
          multiple: false,
          disabled: false,
          placeholder: '请选择',
          checkStrictly: false,
          disableBranchNodes: false,
          collapseTags: false
        })
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
    data() {
      return {
        treeOptionValue: '$$TREE_CONTAINER$$',
        selectedNodes: [],
        nodeMap: new Map()
      };
    },
    computed: {
      nodeKey() {
        return this.config.valueField || 'id';
      },
      treeProps() {
        return {
          children: this.config.childrenField || 'children',
          label: this.config.labelField || 'label',
          disabled: this.isNodeDisabled
        };
      },
      defaultExpandedKeys() {
        return this.options.map(item => item[this.nodeKey]);
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
      },
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
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (this.nodeMap.size === 0 && this.options.length > 0) {
            this.buildNodeMap();
          }
          this.updateSelectedNodes();
          this.$nextTick(() => {
            this.syncTreeState();
          });
        }
      },
      options: {
        immediate: true,
        handler() {
          this.buildNodeMap();
          this.updateSelectedNodes();
        }
      }
    },
    methods: {
      handleFilter(val) {
        this.$refs.tree.filter(val);
      },
      filterNode(value, data) {
        if (!value) return true;
        const label = data[this.treeProps.label];
        return label && label.indexOf(value) !== -1;
      },
      isNodeDisabled(data, node) {
        const childrenField = this.treeProps.children;
        if (this.config.disableBranchNodes) {
          if (data[childrenField] && data[childrenField].length > 0) {
            return true;
          }
        }
        return data.disabled || false;
      },

      handleSelectInput(val) {
        let finalVal = val;
        if (Array.isArray(val)) {
          finalVal = val.filter(v => v !== this.treeOptionValue);
        } else if (val === this.treeOptionValue) {
          finalVal = null;
        }

        this.emitValue('input', finalVal);
        this.emitValue('change', finalVal);
      },

      emitValue(eventName, val) {
        if (this.config.multiple) {
          const emitVal = Array.isArray(val) ? val.join(',') : (val || '');
          this.$emit(eventName, emitVal);
        } else {
          this.$emit(eventName, val);
        }
      },
      syncTreeState() {
        if (!this.$refs.tree) return;

        const val = this.computedValue;
        if (this.config.multiple) {
          this.$refs.tree.setCheckedKeys(Array.isArray(val) ? val : []);
        } else {
          this.$refs.tree.setCurrentKey(val);
        }
      },
      buildNodeMap() {
        this.nodeMap.clear();
        const childrenField = this.treeProps.children;
        const traverse = (nodes) => {
          for (const node of nodes) {
            this.nodeMap.set(node[this.nodeKey], node);
            if (node[childrenField] && node[childrenField].length > 0) {
              traverse(node[childrenField]);
            }
          }
        };
        traverse(this.options);
      },
      updateSelectedNodes() {
        const values = Array.isArray(this.computedValue) ? this.computedValue : [this.computedValue];
        this.selectedNodes = [];
        if (!values.length) return;
        values.forEach(val => {
          const node = this.nodeMap.get(val);
          if (node) {
            this.selectedNodes.push(node);
          }
        });
        if (this.config.allowCreate) {
          const foundValues = this.selectedNodes.map(node => node[this.nodeKey]);
          const missingValues = values.filter(val => !foundValues.includes(val));
          missingValues.forEach(val => {
            const mockNode = {
              [this.nodeKey]: val,
              [this.treeProps.label]: val
            };
            this.selectedNodes.push(mockNode);
          });
        }
      },
      isValueInTree(val) {
        return this.nodeMap.has(val);
      },
      handleNodeClick(data, node) {
        if (this.config.multiple) return;
        if (this.isNodeDisabled(data, node)) return;
        this.emitValue('input', data[this.nodeKey]);
        this.emitValue('change', data[this.nodeKey]);
        this.$refs.select.blur();
      },
      handleCheck(data, { checkedKeys, checkedNodes }) {
        if (!this.config.multiple) return;
        let finalKeys = checkedKeys;
        if (this.config.disableBranchNodes) {
          const childrenField = this.treeProps.children;
          finalKeys = checkedNodes
            .filter(n => !n[childrenField] || n[childrenField].length === 0)
            .map(n => n[this.nodeKey]);
        }
        const currentValues = Array.isArray(this.value) ? this.value : [];
        const createdItems = currentValues.filter(val => !this.isValueInTree(val));
        const newSet = new Set([...createdItems, ...finalKeys]);
        const mergedKeys = Array.from(newSet);
        if (this.config.limit > 0 && mergedKeys.length > this.config.limit) {
          this.$message.warning(`最多只能选择 ${this.config.limit} 项`);
          this.$refs.tree.setCheckedKeys(Array.isArray(this.computedValue) ? this.computedValue : []);
          return;
        }
        this.emitValue('input', mergedKeys);
        this.emitValue('change', mergedKeys);
      },
      handleClear() {
        const val = this.config.multiple ? [] : null;
        this.emitValue('input', val);
        this.emitValue('change', val);
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([]);
          this.$refs.tree.setCurrentKey(null);
        }
      },
      handleRemoveTag(val) {
        if (!this.config.multiple) return;
        const currentVal = this.computedValue || [];
        const newVal = currentVal.filter(v => v !== val);
        this.emitValue('input', newVal);
        this.emitValue('change', newVal);
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(newVal);
        });
      },
      handleVisibleChange(visible) {
        if (visible) {
          this.syncTreeState();
        } else {
          if (this.$refs.tree) {
            this.$refs.tree.filter('');
          }
        }
      }
    }
  };
</script>
<style lang="scss">
  .item-tree-select-popper .el-select-dropdown__wrap {
    height: 274px;
  }
</style>
<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }

  .tree-option-item {
    height: auto;
    line-height: 1;
    padding: 0 !important;
    background-color: #fff;

    &:hover {
      background-color: #fff;
    }
  }

  ::v-deep .el-tree-node__content {
    height: 34px;
  }

  ::v-deep .hide-branch-checkbox .el-tree-node__expand-icon:not(.is-leaf)~.el-checkbox {
    display: none;
  }

  .el-tag__close {
    color: #409EFF;
    background-color: #ecf5ff;

    &:hover {
      background-color: #409EFF;
      color: #fff;
    }
  }

  .custom-tag-colors {
    &.has-text-color ::v-deep .el-select__tags .el-tag {
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

    &.has-bg-color ::v-deep .el-select__tags .el-tag {
      background-color: var(--custom-tag-bg-color);
      border-color: var(--custom-tag-bg-color);
    }
  }
</style>