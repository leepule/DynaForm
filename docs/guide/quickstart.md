# 快速上手

## 基础用法

`DynaForm` 是本库的核心组件。你只需要传入一个配置对象 `config` 和一个绑定值 `value`，组件就会根据 `config.type` 渲染出对应的表单项。

### 示例代码

```vue
<template>
  <div class="app-container">
    <el-form label-width="100px" style="width: 500px">
      
      <!-- 1. 文本输入 -->
      <el-form-item label="用户名">
        <DynaForm
          v-model="form.username"
          :config="{ 
            type: 'text', 
            placeholder: '请输入用户名',
            clearable: true 
          }"
        />
      </el-form-item>

      <!-- 2. 下拉选择 -->
      <el-form-item label="角色">
        <DynaForm
          v-model="form.role"
          :config="{ 
            type: 'select', 
            label: '角色选择',
            multiple: false 
          }"
          :options="roleOptions"
        />
      </el-form-item>

    </el-form>

    <div class="debug-info">
      表单数据: {{ form }}
    </div>
  </div>
</template>

<script>
// 确保已全局注册或在此处局部注册 DynaForm
// 方式1: 全局引入 (推荐)
// import 'dyna-form'; 
// (需在 main.js 中执行 Vue.use)

// 方式2: 按需引入
import { DynaForm } from 'dyna-form';

export default {
  components: { DynaForm },
  data() {
    return {
      form: {
        username: '',
        role: ''
      },
      roleOptions: [
        { value: 'admin', label: '管理员' },
        { value: 'user', label: '普通用户' }
      ]
    };
  }
};
</script>
```

### 通用属性 (Props)

所有组件均支持以下通用属性：

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `config` | Object | `{}` | **(必填)** 配置对象，决定渲染类型及组件参数 |
| `value` / `v-model` | Any | - | 绑定的值 |
| `options` | Array | `[]` | 选项数据 (用于 Select, Cascader, TreeSelect) |
| `size` | String | `'mini'` | 尺寸 (`medium` / `small` / `mini`) |
| `disabled` | Boolean | `false` | 是否禁用 (也可以在 config 中设置) |
