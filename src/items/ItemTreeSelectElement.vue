<template>
  <el-select
    ref="select"
    :value="value"
    :multiple="config.multiple"
    :multiple-limit="config.limit"
    :collapse-tags="config.multiple"
    :disabled="config.disabled"
    :placeholder="config.placeholder"
    :size="size"
    clearable
    :filterable="true"
    :allow-create="config.allowCreate"
    :filter-method="handleFilter"
    popper-class="item-tree-select-popper"
    :class="tagClass"
    :style="tagStyle"
    style="width: 100%"
    @input="handleSelectInput"
    @clear="handleClear"
    @remove-tag="handleRemoveTag"
    @visible-change="handleVisibleChange"
  >
    <!-- Hidden options for displaying selected labels -->
    <el-option
      v-for="item in selectedNodes"
      :key="item[nodeKey]"
      :label="item[treeProps.label]"
      :value="item[nodeKey]"
      style="display: none"
    />
    
    <!-- Tree Container -->
    <el-option :value="treeOptionValue" class="tree-option-item">
      <el-tree
        ref="tree"
        :data="options"
        :props="treeProps"
        :show-checkbox="config.multiple"
        :check-strictly="config.checkStrictly || config.disableBranchNodes"
        :node-key="nodeKey"
        :default-expand-all="false"
        :default-expanded-keys="defaultExpandedKeys"
        :expand-on-click-node="true"
        :highlight-current="!config.multiple"
        :class="{'hide-branch-checkbox': config.disableBranchNodes}"
        :filter-node-method="filterNode"
        @check="handleCheck"
        @node-click="handleNodeClick"
      />
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
        checkStrictly: false, // true keeps parent/child independent
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
      treeOptionValue: '$$TREE_CONTAINER$$', // Placeholder value for the tree option
      selectedNodes: [],
      nodeMap: new Map() // Flattened map for O(1) lookup
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
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        // Ensure map is built if options exist but map is empty (e.g. init)
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

    // Handle updates from el-select (e.g. allow-create, remove-tag, etc.)
    handleSelectInput(val) {
      // Filter out the tree container internal value if it somehow gets selected
      let finalVal = val;
      if (Array.isArray(val)) {
        finalVal = val.filter(v => v !== this.treeOptionValue);
      } else if (val === this.treeOptionValue) {
        finalVal = null; // or empty string depending on requirement
      }
      
      this.$emit('input', finalVal);
      this.$emit('change', finalVal);
    },

    // Sync tree selection based on value
    syncTreeState() {
      if (!this.$refs.tree) return;
      
      const val = this.value;
      if (this.config.multiple) {
        this.$refs.tree.setCheckedKeys(Array.isArray(val) ? val : []);
      } else {
        this.$refs.tree.setCurrentKey(val);
      }
    },
    
    // Build a flat map of all nodes for O(1) access
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

    // Update local selectedNodes for el-select display
    updateSelectedNodes() {
      // Find nodes from options matching the value(s)
      const values = Array.isArray(this.value) ? this.value : [this.value];
      this.selectedNodes = [];
      
      if (!values.length) return;

      // Use Map for O(1) lookup instead of tree traversal
      values.forEach(val => {
        const node = this.nodeMap.get(val);
        if (node) {
          this.selectedNodes.push(node);
        }
      });

      // Handle created values (allow-create)
      if (this.config.allowCreate) {
        // Identify values that were not found in the tree
        // nodeMap lookup is efficient enough here
        const foundValues = this.selectedNodes.map(node => node[this.nodeKey]);
        const missingValues = values.filter(val => !foundValues.includes(val));

        missingValues.forEach(val => {
          // Create a mock node for display
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

    // Handle single node click
    handleNodeClick(data, node) {
      if (this.config.multiple) return; // In multiple mode, usecheckbox
      
      // Disabled nodes should not trigger this, but double check
      if (this.isNodeDisabled(data, node)) return;

      this.$emit('input', data[this.nodeKey]);
      this.$emit('change', data[this.nodeKey]);
      this.$refs.select.blur(); // Close dropdown
    },

    // Handle checkbox change (multiple)
    handleCheck(data, { checkedKeys, checkedNodes }) {
      if (!this.config.multiple) return;
      
      // If disableBranchNodes is true, filter out branch nodes from selection?
      // Element UI tree returns all checked keys.
      // If we want to mimic checkStrictly behavior or disableBranchNodes:
      
      let finalKeys = checkedKeys;
      
      if (this.config.disableBranchNodes) {
        const childrenField = this.treeProps.children;
        finalKeys = checkedNodes
          .filter(n => !n[childrenField] || n[childrenField].length === 0)
          .map(n => n[this.nodeKey]);
      }

      // Preserve created items (values that are NOT in the tree)
      const currentValues = Array.isArray(this.value) ? this.value : [];
      const createdItems = currentValues.filter(val => !this.isValueInTree(val));
      
      // Merge created items with tree selection
      // Ensure no duplicates (though unlikely if logic is correct)
      const newSet = new Set([...createdItems, ...finalKeys]);
      const mergedKeys = Array.from(newSet);
      
      if (this.config.limit > 0 && mergedKeys.length > this.config.limit) {
        this.$message.warning(`最多只能选择 ${this.config.limit} 项`);
        this.$refs.tree.setCheckedKeys(Array.isArray(this.value) ? this.value : []);
        return;
      }
      
      this.$emit('input', mergedKeys);
      this.$emit('change', mergedKeys);
    },

    handleClear() {
      const val = this.config.multiple ? [] : null;
      this.$emit('input', val);
      this.$emit('change', val);
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.setCurrentKey(null);
      }
    },

    handleRemoveTag(val) {
      if (!this.config.multiple) return;
      const currentVal = this.value || [];
      const newVal = currentVal.filter(v => v !== val);
      this.$emit('input', newVal);
      this.$emit('change', newVal);
      this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(newVal);
      });
    },

    handleVisibleChange(visible) {
      if (visible) {
        // Ensure tree state is correct when opening
         this.syncTreeState();
      } else {
         // Clear filter when closing
        if(this.$refs.tree) {
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
.tree-option-item {
  height: auto;
  line-height: 1;
  padding: 0 !important;
  background-color: #fff;

  &:hover {
    background-color: #fff;
  }
}

/* Prevent tree item hover effect from looking like select option hover */
::v-deep .el-tree-node__content {
  height: 34px;
}

/* Hide checkbox for branch nodes when disableBranchNodes is true */
::v-deep .hide-branch-checkbox .el-tree-node__expand-icon:not(.is-leaf) ~ .el-checkbox {
  display: none;
}

/* Default Blue Theme (Restored) */
::v-deep .el-select__tags .el-tag {
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
