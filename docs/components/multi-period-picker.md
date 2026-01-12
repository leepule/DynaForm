# 多周期选择器 (MultiPeriodPicker)

支持按周、按季度选择，并且支持多选的周期选择器。

## 基础用法

### 按周选择 (默认)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="demo-label">多选 (Multiple)</div>
        <MultiPeriodPicker v-model="weekVal1" :multiple="true" />
        <div class="demo-value">Value: {{ weekVal1 }}</div>
      </el-col>
      <el-col :span="12">
        <div class="demo-label">单选 (Single)</div>
        <MultiPeriodPicker v-model="weekVal2" />
        <div class="demo-value">Value: {{ weekVal2 }}</div>
      </el-col>
    </el-row>
  </div>
</template>

### 按季度选择

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="demo-label">多选 (Multiple)</div>
        <MultiPeriodPicker v-model="quarterVal1" type="quarter" :multiple="true" />
        <div class="demo-value">Value: {{ quarterVal1 }}</div>
      </el-col>
      <el-col :span="12">
        <div class="demo-label">单选 (Single)</div>
        <MultiPeriodPicker v-model="quarterVal2" type="quarter" />
        <div class="demo-value">Value: {{ quarterVal2 }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weekVal1: [],
      weekVal2: [],
      quarterVal1: [],
      quarterVal2: []
    }
  }
}
</script>

<style scoped>
.demo-card {
  border: 1px solid #EBEEF5;
  padding: 20px;
  border-radius: 4px;
  margin: 20px 0;
}
.demo-label {
  margin-bottom: 10px;
  font-size: 14px;
  color: #606266;
}
.demo-value {
  margin-top: 10px;
  padding: 5px 10px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 12px;
  color: #909399;
  min-height: 28px;
}
</style>

## 示例代码

```vue
<!-- 按周多选 -->
<MultiPeriodPicker v-model="value1" :multiple="true" />

<!-- 按周单选 (默认) -->
<MultiPeriodPicker v-model="value2" />

<!-- 按季度多选 -->
<MultiPeriodPicker v-model="value3" type="quarter" :multiple="true" />

<!-- 按季度单选 -->
<MultiPeriodPicker v-model="value4" type="quarter" />
```

## 属性列表 (Attributes)

| 属性名 | 说明 | 类型 | 可选值 | 默认值 |
| :--- | :--- | :--- | :--- | :--- |
| value / v-model | 绑定值 | Array | - | [] |
| type | 选择器类型 | String | week / quarter | week |
| multiple | 是否开启多选 | Boolean | - | false |
| placeholder | 输入框占位文本 | String | - | 请选择周期 |
| size | 输入框尺寸 | String | medium / small / mini | mini |

## 事件 (Events)

| 事件名 | 说明 | 回调参数 |
| :--- | :--- | :--- |
| change | 选中值发生变化时触发 | (value: Array) |
