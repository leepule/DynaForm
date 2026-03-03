# 文本输入框 (Text)

最基础的输入组件，对应 Element UI 的 `el-input`。

## 配置类型
- `text`

## 演示 (Demo)

<template>
  <div class="demo-card">
    <el-row :gutter="20">
      <el-col :span="12">
        <h4>基础输入 (Basic)</h4>
        <DynaForm
          v-model="textVal"
          :config="textConfig"
        />
        <div class="demo-value">Value: {{ textVal }}</div>
      </el-col>
      <el-col :span="12">
        <h4>属性增强 (Enhanced)</h4>
        <DynaForm
          v-model="limitVal"
          :config="limitConfig"
        />
        <div class="demo-value">Value: {{ limitVal }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top:20px;">
      <el-col :span="12">
        <h4>密码模式 (Password)</h4>
        <DynaForm
          v-model="passVal"
          :config="{ type: 'TEXT', showPassword: true, placeholder: '请输入密码' }"
        />
        <div class="demo-value">Value: {{ passVal }}</div>
      </el-col>
      <el-col :span="12">
        <h4>文本域 (Textarea)</h4>
        <DynaForm
          v-model="areaVal"
          :config="{ type: 'TEXT', inputType: 'textarea', rows: 3, placeholder: '请输入多行文本' }"
        />
        <div class="demo-value">Value: {{ areaVal }}</div>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
         <h4>禁用状态 (Disabled)</h4>
         <DynaForm
           v-model="val3"
           :config="config3"
         />
      </el-col>
      <el-col :span="12">
         <h4>字数限制 (Length Limit)</h4>
         <DynaForm
            v-model="val4"
            :config="config4"
         />
         <div class="demo-value">Value: {{ val4 }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textVal: 'Hello DynaForm',
      limitVal: '',
      passVal: '',
      areaVal: '第一行\n第二行',
      val1: '',
      val2: '可清空的内容',
      val3: 'Disabled Content',
      val4: '',
      textConfig: {
        type: 'TEXT',
        label: '基础输入',
        placeholder: '请输入内容'
      },
      limitConfig: {
        type: 'TEXT',
        label: '带清空按钮',
        placeholder: '可清空的内容',
        clearable: true
      },
      config1: {
        type: 'TEXT',
        label: '用户名',
        placeholder: '请输入用户名'
      },
      config2: {
        type: 'TEXT',
        label: '昵称',
        placeholder: '请输入昵称',
        clearable: true
      },
      config3: {
        type: 'TEXT',
        label: '账号',
        disabled: true
      },
      config4: {
        type: 'text',
        label: '简介',
        maxlength: 10,
        showWordLimit: true
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
  v-model="username"
  :config="{ type: 'text', label: '用户名' }"
/>

<!-- 2. 可清空 -->
<DynaForm
  v-model="nickname"
  :config="{ type: 'text', label: '昵称', clearable: true }"
/>

<!-- 3. 禁用状态 -->
<DynaForm
  v-model="account"
  :config="{ type: 'text', label: '账号', disabled: true }"
/>

<!-- 4. 字数限制 -->
<DynaForm
  v-model="bio"
  :config="{ 
    type: 'text', 
    label: '简介',
    maxlength: 10,
    showWordLimit: true
  }"
/>
```

## 属性列表 (config)

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `label` | String | 标签文本 |
| `placeholder` | String | 占位符 |
| `disabled` | Boolean | 是否禁用 |
| `readonly` | Boolean | 是否只读 |
| `clearable` | Boolean | 是否可清空 |
| `maxlength` | Number | 最大输入长度 |
| `showWordLimit` | Boolean | 是否显示字数统计 (需配合 maxlength) |
| `minLength` | Number | 最小输入长度 (HTML属性) |
