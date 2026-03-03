# 日期选择器 (DatePicker)

对应 `el-date-picker`，支持日期、时间、范围等多种模式。

## 配置类型
- `date`, `datePicker`
- `datetime`
- `daterange`, `dateRangePicker`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>日期选择 (Date)</h4>
        <DynaForm
          v-model="dateVal"
          :config="dateConfig"
        />
        <div class="demo-value">Value: {{ dateVal }}</div>
      </el-col>
      <el-col :span="12">
        <h4>快捷选项 (Shortcuts)</h4>
        <DynaForm
          v-model="shortVal"
          :config="shortConfig"
        />
        <div class="demo-value">Value: {{ shortVal }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <h4>日期范围 (Daterange)</h4>
        <DynaForm
          v-model="rangeVal"
          :config="{ type: 'DATEPKR', timeType: 'daterange', startPlaceholder: '开始', endPlaceholder: '结束' }"
        />
        <div class="demo-value">Value: {{ rangeVal }}</div>
      </el-col>
      <el-col :span="12">
        <h4>月份范围 (Monthrange)</h4>
        <DynaForm
          v-model="monthRangeVal"
          :config="{ type: 'DATEPKR', timeType: 'monthrange', rangeSeparator: '至' }"
        />
        <div class="demo-value">Value: {{ monthRangeVal }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12">
        <h4>日期时间 (DateTime)</h4>
        <DynaForm v-model="dateTimeVal" :config="dateTimeConfig" />
        <div class="demo-value">Value: {{ dateTimeVal }}</div>
      </el-col>
      <el-col :span="12">
         <h4>月份选择 (Month)</h4>
         <DynaForm v-model="monthVal" :config="monthConfig" />
         <div class="demo-value">Value: {{ monthVal }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateVal: '2023-10-24',
      shortVal: '',
      rangeVal: [],
      monthRangeVal: [],
      dateTimeVal: '',
      monthVal: '',
      
      dateConfig: {
        type: 'DATEPKR',
        label: '选择日期'
      },
      shortConfig: {
        type: 'DATEPKR',
        label: '快捷选择',
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) { picker.$emit('pick', new Date()); }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }]
        }
      },
      rangeConfig: {
        type: 'DATEPKR',
        timeType: 'daterange',
        label: '查询区间',
        startPlaceholder: '开始',
        endPlaceholder: '结束',
        valueFormat: 'yyyy-MM-dd'
      },
      dateTimeConfig: {
        type: 'DATEPKR',
        timeType: 'datetime',
        label: '预定时间',
        format: 'yyyy-MM-dd HH:mm',
        valueFormat: 'yyyy-MM-dd HH:mm'
      },
      monthConfig: {
        type: 'DATEPKR',
        timeType: 'month',
        label: '月报账期',
        format: 'yyyy-MM',
        valueFormat: 'yyyy-MM'
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
h4 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 14px;
    color: #333;
}
</style>

## 示例代码

```vue
<!-- 1. 单个日期 -->
<DynaForm
  v-model="date"
  :config="{
    type: 'DATEPKR',
    label: '日期',
    format: 'yyyy-MM-dd',
    valueFormat: 'yyyy-MM-dd'
  }"
/>

<!-- 2. 日期范围 -->
<DynaForm
  v-model="range"
  :config="{
    type: 'DATEPKR',
    timeType: 'daterange',
    label: '时间范围',
    startPlaceholder: '开始',
    endPlaceholder: '结束'
  }"
/>

<!-- 3. 日期时间 -->
<DynaForm
  v-model="datetime"
  :config="{
    type: 'DATEPKR',
    timeType: 'datetime',
    label: '精确时间'
  }"
/>

<!-- 4. 月份 -->
<DynaForm
  v-model="month"
  :config="{
    type: 'DATEPKR',
    timeType: 'month',
    label: '月份',
    format: 'yyyy-MM',
    valueFormat: 'yyyy-MM'
  }"
/>
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `timeType` | String | 具体类型: `date`, `week`, `month`, `year`, `datetime`, `daterange`, `datetimerange` |
| `format` | String | 输入框显示格式 |
| `valueFormat` | String | 绑定值的格式 |
| `readonly` | Boolean | 是否只读 |
| `disabled` | Boolean | 是否禁用 |
