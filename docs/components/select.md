# 下拉选择框 (Select)

功能增强版的 `el-select`。

## 配置类型
- `select`
- `selectPicker`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>基础单选 (Basic)</h4>
        <DynaForm
          v-model="singleVal" 
          :config="singleConfig" 
          :options="basicOptions"
        />
        <div class="demo-value">Value: {{ singleVal }}</div>
      </el-col>
      <el-col :span="12">
        <h4>多选 + 标签限制 (Multiple)</h4>
        <DynaForm 
           v-model="multiVal" 
           :config="multiConfig" 
           :options="basicOptions"
        />
        <div class="demo-value">Value: {{ multiVal }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
          <h4>分组选项 (Grouped)</h4>
          <DynaForm
             v-model="groupVal"
             :config="groupConfig"
             :options="groupOptions"
          />
          <div class="demo-value">Value: {{ groupVal }}</div>
      </el-col>
      <el-col :span="12">
          <h4>可搜索 + 可创建 (Filterable + Create)</h4>
          <DynaForm
             v-model="createVal"
             :config="createConfig"
             :options="basicOptions"
          />
          <div class="demo-value">Value: {{ createVal }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      singleVal: 1,
      multiVal: [1, 2, 3],
      groupVal: '',
      createVal: [],

      basicOptions: [
        { value: 1, label: '苹果' },
        { value: 2, label: '香蕉' },
        { value: 3, label: '橘子' },
        { value: 4, label: '葡萄' },
        { value: 5, label: '西瓜' }
      ],

      groupOptions: [
        {
          label: '热带水果',
          options: [
            { value: 'mango', label: '芒果' },
            { value: 'durian', label: '榴莲' }
          ]
        },
        {
          label: '温带水果',
          options: [
            { value: 'apple', label: '苹果' },
            { value: 'pear', label: '梨' }
          ]
        }
      ],

      singleConfig: {
        type: 'select',
        label: '水果',
        filterable: true
      },
      multiConfig: {
        type: 'select',
        label: '多选限制',
        multiple: true,
        limit: 2, // 最多显示2个tag
        filterable: true
      },
      groupConfig: {
        type: 'select',
        label: '分组选择'
      },
      createConfig: {
        type: 'select',
        label: '自定义',
        multiple: true,
        filterable: true,
        allowCreate: true
      }
    };
  }
};
</script>

<style scoped>
.demo-card {
  border: 1px solid #EBEEF5;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
}
.demo-value {
  margin-top: 5px;
  margin-bottom: 20px;
  padding: 5px 10px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
}
h4 { margin-top: 0; font-size: 14px; margin-bottom: 10px; }
</style>

## 示例代码

```vue
<!-- 1. 基础单选 -->
<DynaForm
  v-model="value"
  :config="{ type: 'select', label: '单选', filterable: true }"
  :options="options"
/>

<!-- 2. 多选 + 限制Tag数 -->
<DynaForm
  v-model="tags"
  :config="{ 
      type: 'select', 
      multiple: true, 
      limit: 2, 
      filterable: true 
  }"
  :options="options"
/>

<!-- 3. 分组 -->
<DynaForm
  v-model="group"
  :config="{ type: 'select' }"
  :options="[
     { label: 'Group A', options: [...] },
     { label: 'Group B', options: [...] }
  ]"
/>

<!-- 4. 可创建条目 -->
<DynaForm
  v-model="newTags"
  :config="{ 
      type: 'select', 
      multiple: true, 
      allowCreate: true,
      filterable: true
  }"
  :options="options"
/>
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `multiple` | Boolean | 是否开启多选 |
| `limit` | Number | 多选时最多显示的标签数 |
| `filterable` | Boolean | 是否可搜索 |
| `allowCreate` | Boolean | 是否允许创建新条目 |
| `valueField` | String | 自定义值字段名 |
| `labelField` | String | 自定义标签字段名 |
| `tagColor` | String | 已选标签文字颜色 |
| `tagBackgroundColor` | String | 已选标签背景颜色 |
