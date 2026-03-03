# 开关 (Switch)

基于 `el-switch` 封装，支持通过配置动态设置激活/非激活状态的值和显示内容。

## 配置类型
- `switch`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="8">
        <h4>基础用法 (Basic)</h4>
        <DynaForm
          v-model="val1" 
          :config="config1" 
        />
        <div class="demo-value">Value: {{ val1 }}</div>
      </el-col>
      <el-col :span="8">
        <h4>自定义值 (Custom Values)</h4>
        <DynaForm 
          v-model="val2" 
          :config="config2" 
        />
        <div class="demo-value">Value: {{ val2 }} (Type: {{ typeof val2 }})</div>
      </el-col>
      <el-col :span="8">
        <h4>自定义颜色 & 文字</h4>
        <DynaForm 
          v-model="val3" 
          :config="config3" 
        />
        <div class="demo-value">Value: {{ val3 }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val1: false,
      val2: '1',
      val3: true,
      config1: {
        type: 'SWITCH',
        label: '基础开关'
      },
      config2: {
        type: 'SWITCH',
        label: '字符串值',
        activeValue: '1',
        inactiveValue: '0'
      },
      config3: {
        type: 'SWITCH',
        label: '丰富样式',
        activeColor: '#13ce66',
        inactiveColor: '#ff4949',
        activeText: '按年',
        inactiveText: '按月'
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
  v-model="val"
  :config="{ type: 'SWITCH', label: '开/关' }"
/>

<!-- 2. 自定义激活/非激活值 -->
<DynaForm
  v-model="val"
  :config="{ 
    type: 'SWITCH', 
    activeValue: 'on', 
    inactiveValue: 'off' 
  }"
/>

<!-- 3. 自定义颜色与辅助文字 -->
<DynaForm
  v-model="val"
  :config="{ 
    type: 'SWITCH',
    activeColor: '#13ce66',
    inactiveColor: '#ff4949',
    activeText: '启用',
    inactiveText: '禁用'
  }"
/>
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `activeValue` | Boolean/String/Number | 激活状态的值 |
| `inactiveValue` | Boolean/String/Number | 非激活状态的值 |
| `activeText` | String | 激活状态的描述文字 |
| `inactiveText` | String | 非激活状态的描述文字 |
| `activeColor` | String | 激活状态的背景颜色 |
| `inactiveColor` | String | 非激活状态的背景颜色 |
| `disabled` | Boolean | 是否禁用 |
