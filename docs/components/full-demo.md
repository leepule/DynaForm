# 综合演示 (Full Demo)

本页面展示了如何将多个 `DynaForm` 组件组合成一个复杂的业务表单，并支持不同的尺寸切换。

## 完整表单演示

<common-FullDemo />

## 示例代码

```vue
<template>
  <div class="demo-container">
    <div class="control-panel">
      <el-radio-group v-model="currentSize" size="small">
        <el-radio-button label="medium">Medium</el-radio-button>
        <el-radio-button label="small">Small</el-radio-button>
        <el-radio-button label="mini">Mini</el-radio-button>
      </el-radio-group>
    </div>
    <el-form :model="form" ref="form" label-width="150px">
      <el-form-item
        v-for="(itemConfig, index) in configList"
        :key="index"
        :label="itemConfig.label"
        :prop="itemConfig.prop">
        <DynaForm
          :config="itemConfig"
          v-model="form[itemConfig.prop]"
          :options="getOptions(itemConfig.prop)"
          :tableOptions="getTableOptions(itemConfig.prop)"
          :total="getTotal(itemConfig.prop)"
          :size="currentSize"
          :style="{ width: itemConfig.width ? itemConfig.width + 'px' : '' }"
          @node-click="(data) => handleNodeClick(itemConfig.prop, data)"
          @page-change="(params) => handlePageChange(itemConfig.prop, params)">
        </DynaForm>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSize: "small",
      form: {},
      configList: [
        { label: "文本框", type: "TEXT", prop: "name", width: 200, defaultValue: "张三" },
        { label: "数字", type: "NUMBOX", prop: "age", width: 200, defaultValue: 25 },
        { label: "开关", type: "SWITCH", prop: "status", defaultValue: true },
        { 
          label: "人员选择", 
          type: "PERSONPKR", 
          prop: "leader", 
          width: 250, 
          multiple: true,
          columns: [
            { prop: "xm", label: "姓名" },
            { prop: "deptName", label: "部门" }
          ]
        }
      ],
      // 模拟选项数据
      optionsMap: { ... },
      // 模拟表格数据 (人员选择器)
      dynamicTableOptions: { ... }
    }
  },
  methods: {
    getOptions(prop) { ... },
    handleNodeClick(prop, data) { ... },
    handlePageChange(prop, params) { ... }
  }
}
</script>
```
