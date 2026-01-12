# 级联选择器 (Cascader)

对应 `el-cascader`。

## 配置类型
- `cascader`
- `cascaderPicker`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>基础级联 (单选)</h4>
        <DynaForm v-model="val1" :config="config1" :options="options"/>
        <div class="demo-value">Value: {{ val1 }}</div>
      </el-col>
      <el-col :span="12">
        <h4>任意级可选 (CheckStrictly)</h4>
        <DynaForm v-model="val2" :config="config2" :options="options"/>
        <div class="demo-value">Value: {{ val2 }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12">
        <h4>多选 (Multiple)</h4>
        <DynaForm v-model="val3" :config="config3" :options="options"/>
        <div class="demo-value">Value: {{ val3 }}</div>
      </el-col>
      <el-col :span="12">
        <h4>多选 + 折叠</h4>
        <DynaForm v-model="val4" :config="config4" :options="options"/>
        <div class="demo-value">Value: {{ val4 }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val1: [],
      val2: [],
      val3: [],
      val4: [],
      
      options: [
        {
          value: 1, label: '浙江',
          children: [
            {
              value: 11, label: '杭州',
              children: [
                { value: 111, label: '西湖' }
              ]
            }
          ]
        },
        {
          value: 2, label: '江苏',
          children: [
            {
              value: 21, label: '南京',
              children: [
                { value: 211, label: '中华门' }
              ]
            }
          ]
        }
      ],
      
      config1: {
        type: 'cascader',
        label: '地区'
      },
      config2: {
        type: 'cascader',
        label: '任意级',
        checkStrictly: true
      },
      config3: {
        type: 'cascader',
        label: '多选',
        multiple: true
      },
      config4: {
        type: 'cascader',
        label: '折叠显示',
        multiple: true,
        collapseTags: true
      }
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
<!-- 1. 基础单选 -->
<DynaForm
  v-model="val"
  :config="{ type: 'cascader', label: '地区' }"
  :options="options"
/>

<!-- 2. 任意级可选 -->
<DynaForm
  v-model="val"
  :config="{ type: 'cascader', label: '任意级', checkStrictly: true }"
  :options="options"
/>

<!-- 3. 多选 -->
<DynaForm
  v-model="val"
  :config="{ type: 'cascader', label: '多选', multiple: true }"
  :options="options"
/>
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `multiple` | Boolean | 是否开启多选 |
| `checkStrictly` | Boolean | 是否任意一级可选 |
| `showAllLevels` | Boolean | 是否显示完整路径 |
| `collapseTags` | Boolean | 多选时是否折叠标签 |
| `valueField` | String | 自定义值字段名 |
| `labelField` | String | 自定义标签字段名 |
| `childrenField` | String | 自定义子级字段名 |
