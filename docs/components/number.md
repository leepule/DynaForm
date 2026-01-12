# 数字输入框 (Number)

对应 `el-input-number`，用于数值输入。

## 配置类型
- `number`
- `numberbox`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>基础用法</h4>
        <DynaForm
          v-model="val1"
          :config="config1"
        />
        <div class="demo-value">Value: {{ val1 }}</div>
      </el-col>
      <el-col :span="12">
        <h4>步长与精度 (Step & Precision)</h4>
        <DynaForm
          v-model="val2"
          :config="config2"
        />
        <div class="demo-value">Value: {{ val2 }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
         <h4>范围限制 (Min/Max)</h4>
         <DynaForm
           v-model="val3"
           :config="config3"
         />
         <div class="demo-value">Value: {{ val3 }} (0~10)</div>
      </el-col>
      <el-col :span="12">
         <h4>禁用状态 (Disabled)</h4>
         <DynaForm
           v-model="val4"
           :config="config4"
         />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val1: 1,
      val2: 1.5,
      val3: 5,
      val4: 100,
      config1: {
        type: 'number',
        label: '数量'
      },
      config2: {
        type: 'number',
        label: '金额',
        step: 0.1,
        precision: 2
      },
      config3: {
        type: 'number',
        label: '评分',
        min: 0,
        max: 10
      },
      config4: {
        type: 'number',
        label: '库存',
        disabled: true
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
<!-- 1. 基础用法 -->
<DynaForm
  v-model="count"
  :config="{ type: 'number', label: '数量' }"
/>

<!-- 2. 步长与精度 -->
<DynaForm
  v-model="money"
  :config="{ 
    type: 'number', 
    label: '金额',
    step: 0.1,
    precision: 2
  }"
/>

<!-- 3. 范围限制 -->
<DynaForm
  v-model="score"
  :config="{ 
    type: 'number', 
    label: '评分',
    min: 0,
    max: 10
  }"
/>
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `min` | Number | 最小值 |
| `max` | Number | 最大值 |
| `step` | Number | 步长 |
| `precision` | Number | 数值精度 (保留小数位数) |
| `disabled` | Boolean | 是否禁用 |
| `readonly` | Boolean | 是否只读 |
