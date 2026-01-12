<template>
  <div class="item-person-picker">
    <!-- Read-only Input Trigger -->
    <el-select
      v-model="selectModel"
      :placeholder="config.placeholder || '请选择人员'"
      :disabled="config.disabled"
      :size="size"
      :multiple="isMultiple"
      style="width: 100%"
      :class="tagClass"
      :style="tagStyle"
      popper-class="person-picker-popper-hide"
      @visible-change="handleSelectVisibleChange"
      @remove-tag="handleRemoveTag"
      @clear="handleClear"
      clearable
      ref="select"
    >
        <el-option
            v-for="item in selectedCache"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        >
        </el-option>
    </el-select>

    <!-- Dialog -->
    <el-dialog
      :title="config.label || '用户选择'"
      :visible.sync="visible"
      width="1100px" 
      append-to-body
      :close-on-click-modal="false"
      custom-class="person-picker-dialog"
      top="5vh"
    >
      <div class="picker-body">
          <div class="picker-container">
            <!-- Left: Department Tree -->
            <div class="column left-panel">
              <div class="panel-header">
                  <span>组织机构</span>
              </div>
              <div class="panel-content">
                <el-tree
                  ref="tree"
                  :data="options"
                  :props="treeProps"
                  node-key="id"
                  highlight-current
                  default-expand-all
                  :expand-on-click-node="false"
                  @node-click="handleNodeClick"
                >
                 <span class="custom-tree-node" slot-scope="{ node, data }">
                    <i :class="data.children ? 'el-icon-folder' : 'el-icon-document'"></i>
                    <span style="margin-left:5px">{{ node.label }}</span>
                 </span>
                </el-tree>
              </div>
            </div>

            <!-- Middle: Main Content (Search + Table) -->
            <div class="column main-panel">
               <!-- 1. Search Bar -->
               <div class="search-bar">
                   <el-form :inline="true" :model="searchForm" size="mini" class="search-form">
                       <el-form-item label="关键词">
                           <el-input v-model="searchForm.keywords" placeholder="请输入关键词" clearable></el-input>
                       </el-form-item>
                       <el-form-item>
                           <el-button type="primary" @click="handleSearch" icon="el-icon-search">查询</el-button>
                           <el-button @click="handleReset" icon="el-icon-refresh-right">重置</el-button>
                       </el-form-item>
                   </el-form>
               </div>

               <!-- 2. Table -->
               <div class="table-wrapper">
                <div v-if="tableColumns.length === 0" class="config-error">
                    <i class="el-icon-warning-outline"></i>
                    <span>未配置表格列信息 (columns)，请检查配置</span>
                </div>
                <el-table
                  v-else
                  ref="table"
                  :data="displayTableData"
                  style="width: 100%"
                  height="100%"
                  size="small"
                  @selection-change="handleSelectionChange"
                  @row-click="handleRowClick"
                  row-key="id"
                  stripe
                  border
                  header-row-class-name="table-header-gray"
                >
                  <el-table-column 
                    v-if="isMultiple"
                    type="selection" 
                    width="45" 
                    align="center"
                    :reserve-selection="true"
                    fixed="left"
                  ></el-table-column>
                  
                  <el-table-column v-else width="45" label="" align="center">
                    <template slot-scope="scope">
                        <el-radio 
                            v-model="singleSelectionId" 
                            :label="scope.row.id"
                            @change="handleSingleRadioChange(scope.row)"
                        ><i></i></el-radio>
                    </template>
                  </el-table-column>

                  <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                  <el-table-column
                    v-for="col in tableColumns"
                    :key="col.prop"
                    :prop="col.prop"
                    :label="col.label"
                    :width="col.width"
                    :min-width="col.minWidth"
                    :align="col.align || 'left'"
                    show-overflow-tooltip
                  >
                     <template slot-scope="scope">
                         <!-- Custom Renderer for Status -->
                         <div v-if="col.prop === 'status'">
                              <el-tag size="mini" :type="scope.row.status === 'inactive' ? 'danger' : 'primary'">
                                  {{ scope.row.status === 'inactive' ? '禁用' : '正常' }}
                              </el-tag>
                         </div>
                         <!-- Custom Renderer for Dept (Fallback if empty) -->
                         <span v-else-if="col.prop === 'deptName'">
                             {{ scope.row.deptName || currentDeptName }}
                         </span>
                         <!-- Custom Renderer for Account (Fallback) -->
                         <span v-else-if="col.prop === 'account'">
                             {{ scope.row.account || ('user'+scope.row.id) }}
                         </span>
                         <!-- Default Text -->
                         <span v-else>{{ scope.row[col.prop] }}</span>
                     </template>
                  </el-table-column>
                </el-table>
              </div>

              <!-- 3. Pagination -->
              <div class="panel-footer">
                  <el-pagination
                    background
                    layout="total, prev, pager, next, sizes"
                    :current-page.sync="currentPage"
                    :page-size.sync="currentSizeLocal"
                    :page-sizes="[5, 10, 20, 50, 100]"
                    :total="displayTotal"
                    @current-change="handlePageChange"
                    @size-change="handleSizeChange"
                    :pager-count="5"
                  >
                  </el-pagination>
              </div>
            </div>

            <!-- Right: Selected Items -->
            <div class="column right-panel">
                <div class="panel-header">
                    <span>当前已选 {{ tempSelected.length }} 项</span>
                    <el-button 
                      type="text" 
                      size="mini" 
                      v-if="tempSelected.length > 0" 
                      class="clear-btn"
                      @click="clearAll"
                    >清空</el-button>
                </div>
                <div class="panel-content selected-list">
                    <el-tag
                        v-for="item in tempSelected"
                        :key="item.id"
                        closable
                        size="medium"
                        @close="removeItem(item)"
                        class="selected-tag"
                        disable-transitions
                    >
                        {{ item.name }}
                    </el-tag>
                     <div v-if="tempSelected.length === 0" class="empty-tip">
                        <span>暂无选择</span>
                    </div>
                </div>
            </div>
          </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ItemPersonPicker",
  props: {
    value: {
      type: [Array, String, Number], 
      default: () => []
    },
    config: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array, // Tree data
      default: () => []
    },
    tableOptions: {
      type: Array, // Flat employee data (either all or current page)
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
  data() {
    return {
      visible: false,
      currentDeptName: '',
      currentDeptId: null, 
      tableData: [], 
      currentPage: 1,
      currentSizeLocal: this.config.pageSize || this.pageSize || 10,
      tempSelected: [], 
      singleSelectionId: null, 
      employeeMap: new Map(),
      searchForm: {
          keywords: ''
      },
      selectedCache: []
    };
  },
  computed: {
    isMultiple() {
       return this.config.multiple !== false; 
    },
    // Removed useApi

    treeProps() {
      return {
        children: this.config.childrenField || 'children',
        label: this.config.labelField || 'label'
      };
    },
    tableColumns() {
       if (this.config.columns && Array.isArray(this.config.columns) && this.config.columns.length > 0) {
           return this.config.columns;
       }
       console.error('ItemPersonPicker: config.columns is required!');
       return [];
    },
    displayTableData() {
        return this.tableData;
    },
    displayTotal() {
        return this.total;
    },
    selectModel: {
        get() {
            return this.value;
        },
        set(val) {
            this.$emit('input', val);
            this.$emit('change', val);
        }
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
    tableOptions: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
            val.forEach(emp => {
                if (!this.employeeMap.has(emp.id)) {
                    this.employeeMap.set(emp.id, emp);
                }
            });
        }
        // Always update tableData from tableOptions prop (API behavior)
        this.tableData = val || [];
        
        this.$nextTick(() => {
            this.syncTableSelection();
            this.updateSelectedCache();
        });
      }
    },
    value: {
        immediate: true,
        handler() {
            this.updateSelectedCache();
        }
    },
    visible(val) {
      if (val) {
        this.initSession();
      } else {
          if (this.$refs.table) {
             this.$refs.table.clearSelection();
          }
      }
    }
  },
  methods: {
    showDialog() {
      if (this.config.disabled) return;
      this.visible = true;
    },
    initSession() {
        this.tempSelected = [];
        this.singleSelectionId = null;
        this.searchForm.name = '';
        this.searchForm.account = '';
        this.currentPage = 1;

        if (this.isMultiple) {
            if (Array.isArray(this.value)) {
                this.value.forEach(id => {
                    if (this.employeeMap.has(id)) {
                        this.tempSelected.push(this.employeeMap.get(id));
                    } else {
                        this.tempSelected.push({ id, name: id }); 
                    }
                });
            }
        } else {
             if (this.value) {
                 const id = this.value;
                 this.singleSelectionId = id;
                 if (this.employeeMap.has(id)) {
                     this.tempSelected = [this.employeeMap.get(id)];
                 } else {
                     this.tempSelected = [{ id, name: id }];
                 }
             }
        }
        
        this.$nextTick(() => {
            this.syncTableSelection();
            // Trigger initial data load
            this.handleSearch();
        });
    },
    handleNodeClick(data) {
      this.currentDeptName = data[this.treeProps.label];
      this.currentDeptId = data.id; 
      this.currentPage = 1; 
      
      this.$emit('node-click', data); 
    },
    handlePageChange(page) {
        this.$emit('page-change', {
            page: page,
            pageSize: this.currentSizeLocal,
            deptId: this.currentDeptId,
            search: this.searchForm 
        });
        
        this.$nextTick(() => {
             this.syncTableSelection();
        });
    },
    handleSizeChange(size) {
        this.currentSizeLocal = size;
        this.currentPage = 1;
        this.handlePageChange(1);
    },
    handleSearch() {
        this.currentPage = 1;
        this.$emit('page-change', {
            page: 1,
            pageSize: this.currentSizeLocal,
            deptId: this.currentDeptId,
            search: this.searchForm
        });
    },
    handleReset() {
        this.searchForm.keywords = '';
        this.handleSearch();
    },
    handleSelectionChange(selection) {
      if (!this.isMultiple) return;
      this.tempSelected = selection;
      selection.forEach(item => this.employeeMap.set(item.id, item));
    },
    handleSingleRadioChange(row) {
        this.singleSelectionId = row.id;
        this.tempSelected = [row];
        this.employeeMap.set(row.id, row);
    },
    handleRowClick(row) {
        if (!this.isMultiple) {
            this.handleSingleRadioChange(row);
        } else {
            this.$refs.table.toggleRowSelection(row);
        }
    },
    removeItem(item) {
        const index = this.tempSelected.findIndex(i => i.id === item.id);
        if (index > -1) {
            this.tempSelected.splice(index, 1);
        }
        
        if (this.isMultiple) {
             const row = this.tableData.find(r => r.id === item.id);
             if (row) {
                 this.$refs.table.toggleRowSelection(row, false);
             } else {
                 this.$refs.table.toggleRowSelection(item, false);
             }
        } else {
            this.singleSelectionId = null;
        }
    },
    clearAll() {
        this.tempSelected = [];
        this.singleSelectionId = null;
        if (this.isMultiple) {
            this.$refs.table.clearSelection();
        }
    },
    syncTableSelection() {
        if (!this.$refs.table) return;
        if (this.isMultiple) {
             this.tempSelected.forEach(row => {
                 const current = this.displayTableData.find(r => r.id === row.id);
                 if (current) {
                     this.$refs.table.toggleRowSelection(current, true);
                 }
             });
        }
    },
    confirm() {
      if (this.isMultiple) {
          const ids = this.tempSelected.map(i => i.id);
          this.$emit('input', ids);
          this.$emit('change', ids); 
      } else {
          const val = this.tempSelected.length > 0 ? this.tempSelected[0].id : null;
          this.$emit('input', val);
          this.$emit('change', val);
      }
      this.visible = false;
    },
    updateSelectedCache() {
      const ids = Array.isArray(this.value) ? this.value : (this.value ? [this.value] : []);
      // Ensure unique IDs in fallback
      this.selectedCache = ids.map(id => {
          if (this.employeeMap.has(id)) {
              return this.employeeMap.get(id);
          }
          return { id: id, name: id };
      });
    },
    handleSelectVisibleChange(visible) {
        if (visible) {
            this.showDialog();
            this.$nextTick(() => {
                 this.$refs.select.blur();
            });
        }
    },
    handleRemoveTag(val) {
        // el-select updates v-model automatically, which triggers setter -> emit input -> parent updates prop -> watch value -> updateSelectedCache
        // So strictly speaking, we might not need to do anything here if the flow is correct.
        // But for safety or if parent doesn't update immediately?
        // Actually, el-select removes it from the internal array passed to emit.
    },
    handleClear() {
        // handled by v-model set([]) or set(null) from el-select
    }
  }
};
</script>

<style lang="scss" scoped>
.picker-body {
    height: 650px;
    background: #f5f7fa;
    box-sizing: border-box;

    .picker-container {
        display: flex;
        height: 100%;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        border: 1px solid #EBEEF5;

        .column {
            display: flex;
            flex-direction: column;
            border-right: 1px solid #EBEEF5;

            &:last-child {
                border-right: none;
            }

            &.left-panel {
                width: 240px;
            }

            &.main-panel {
                flex: 1;
                min-width: 0;
                padding: 10px 15px;

                .search-bar {
                    padding-bottom: 15px;
                    border-bottom: 1px dashed #EBEEF5;

                    .search-form .el-form-item {
                        margin-bottom: 0;
                    }
                }

                .table-wrapper {
                    flex: 1;
                    overflow: hidden; 
                    margin-bottom: 10px;
                    margin-top: 10px;

                    .config-error {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        color: #909399;
                        font-size: 14px;
                        background: #f5f7fa;
                        border: 1px dashed #dcdfe6;
                        border-radius: 4px;

                        i {
                            font-size: 24px;
                            color: #E6A23C;
                            margin-bottom: 8px;
                        }
                    }
                }
            }

            &.right-panel {
                width: 220px;
                background-color: #FAFAFA;

                .selected-list {
                    padding: 10px;
                    display: flex;
                    flex-wrap: wrap; 
                    align-content: flex-start;

                    .selected-tag {
                        margin-right: 5px;
                        margin-bottom: 5px;
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .empty-tip {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex: 1;
                        text-align: center;
                        color: #909399;
                        font-size: 13px;
                        margin-top: 40px;
                    }
                }

                .clear-btn {
                    color: #F56C6C;
                }
            }

            .panel-header {
                height: 40px;
                line-height: 40px;
                padding: 0 10px;
                font-weight: 600;
                font-size: 14px;
                border-bottom: 1px solid #EBEEF5;
                background: #FAFAFA;
                color: #333;
                display: flex;
                justify-content: space-between;
            }

            .panel-content {
                flex: 1;
                overflow: auto;
                padding: 10px 0;
            }

            .panel-footer {
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
        }
    }
}

::v-deep .table-header-gray th {
    background-color: #FAFAFA !important;
    color: #333;
    font-weight: 600;
}

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

<style lang="scss">
/* Global override for appended dialog */
.person-picker-dialog {
    .el-dialog__body {
        padding: 0 !important;
    }
}
.person-picker-popper-hide {
    display: none !important;
}
</style>
