# 树形选择器 (TreeSelect)

下拉树组件，结合 Select 和 Tree 的功能。

## 配置类型
- `selecttree`
- `deptPicker`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>单选 (Single)</h4>
        <DynaForm
          v-model="singleVal"
          :config="singleConfig"
          :options="options"
        />
        <div class="demo-value">Value: {{ singleVal }}</div>
      </el-col>
      <el-col :span="12">
        <h4>多选 (Multiple)</h4>
        <DynaForm
          v-model="multiVal"
          :config="multiConfig"
          :options="options"
        />
        <div class="demo-value">Value: {{ multiVal }}</div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top:20px">
       <el-col :span="12">
          <h4>仅选叶子节点 (Only Leaf)</h4>
          <DynaForm
            v-model="leafVal"
            :config="leafConfig"
            :options="options"
          />
          <div class="demo-value">Value: {{ leafVal }}</div>
       </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      singleVal: null,
      multiVal: [],
      leafVal: [],
      
      singleConfig: {
        type: 'selecttree',
        label: '部门(单选)',
        checkStrictly: true // 允许选择任意节点
      },
      multiConfig: {
        type: 'selecttree',
        label: '部门(多选)',
        multiple: true,
        checkStrictly: false, // 级联选择
        disableBranchNodes: false
      },
      leafConfig: {
         type: 'selecttree',
         label: '仅选叶子',
         multiple: true,
         disableBranchNodes: true // 禁用分支节点
      },
      
      options: [
        {
          id: 1,
          label: '总部',
          children: [
             { id: 2, label: '研发部' },
             { id: 3, label: '市场部' }
          ]
        },
        {
          id: 4,
          label: '分公司',
          children: [
             { 
                id: 5, 
                label: '上海分部',
                children: [
                    { id: 6, label: '开发组' }
                ]
             }
          ]
        }
      ]
    };
  }
};
</script>

<style scoped>
.demo-card { border: 1px solid #EBEEF5; padding: 20px; border-radius: 4px; margin: 20px 0; }
.demo-value { margin-top: 15px; padding: 10px; background: #f5f7fa; font-size: 13px; color: #606266; }
h4 { margin-top: 0; font-size: 14px; margin-bottom: 10px; }
</style>

## 示例代码

```vue
<!-- 1. 单选 (任意节点) -->
<DynaForm
  v-model="deptId"
  :config="{
    type: 'selecttree',
    label: '部门',
    checkStrictly: true
  }"
  :options="treeData"
/>

<!-- 2. 多选 (联动) -->
<DynaForm
  v-model="deptIds"
  :config="{
    type: 'selecttree',
    label: '部门',
    multiple: true,
    checkStrictly: false
  }"
  :options="treeData"
/>

<!-- 3. 仅选择叶子节点 -->
<DynaForm
  v-model="leafIds"
  :config="{
    type: 'selecttree',
    label: '部门',
    multiple: true,
    disableBranchNodes: true
  }"
  :options="treeData"
/>
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `multiple` | Boolean | 是否开启多选 |
| `checkStrictly` | Boolean | 是否严格模式 (父子不互相关联) |
| `disableBranchNodes` | Boolean | 是否禁用分支节点 (仅允许选择叶子节点) |
| `filterable` | Boolean | 是否可搜索 |
| `valueField` | String | 自定义值字段名 |
| `labelField` | String | 自定义标签字段名 |
| `childrenField` | String | 自定义子级字段名 |
