# DynaForm (Custom UI Components)

DynaForm 是基于 `element-ui` 构建的 Vue 2 高级组件库，专为数据驱动的表单渲染设计。

## ✨ 特性

- **样式升级**: 全面倒入 SCSS，支持样式嵌套与 `::v-deep` 穿透，易于定制。
- **文档完善**: 在 `docs/` 目录下提供了完整的 [VuePress](https://vuepress.vuejs.org/) 格式文档。
- **数据驱动**: 核心组件 `DynaForm` 可根据 JSON 配置自动渲染各类表单项。
- **组件丰富**:
  - **基础组件**: 文本 (Text)、数字 (Number)、日期 (DatePicker)。
  - **选择类组件**:
    - **Select**: 支持分组、多选、搜索、创建条目 (`allow-create`)、扁平化展示等。
    - **Cascader**: 级联选择器，支持严格模式配置。
    - **TreeSelect**: 基于 `el-select` + `el-tree` 封装，支持 `disableBranchNodes`、`checkStrictly` 及 Element UI 风格适配。
  - **高级业务组件**:
    - **PersonPicker**: 完整的人员选择器，包含左侧组织树、右侧人员表格（支持分页/搜索/多选/反选）、已选人员标签管理等。
    - **MultiPeriodPicker**: 灵活的周期选择器，支持**季度**、**周**时间维度的选择与切换。
- **尺寸适配**: 全面支持 `medium` / `small` / `mini` 三种尺寸，UI 高度统一。
- **插槽扩展**: 复杂的业务场景可通过插槽机制完全自定义。

## 📦 安装

```bash
npm install dyna-form
# 或
yarn add dyna-form
```

### 依赖项 (Peer Dependencies)

项目依赖以下包，请确保在宿主项目中安装：

```bash
npm install element-ui sass sass-loader
```

## 🚀 快速上手

### 1. 全局注册 (Global Registration)

在入口文件（如 `main.js`）中引入 Element UI 和组件库：

```javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import DynaForm from 'dyna-form';

Vue.use(ElementUI);
// 全局注册所有组件
Vue.use(DynaForm);
```

### 2. 按需引入 (On-Demand Import)

如果只需使用特定组件，可以按需引入：

```javascript
import { DynaForm, ItemPersonPicker } from 'dyna-form';

export default {
  components: {
    DynaForm,
    ItemPersonPicker
  }
}
```

### 3. 使用示例

```vue
<template>
  <el-form label-width="120px">
    <!-- 普通文本 -->
    <el-form-item label="用户名">
      <DynaForm
        :config="{ type: 'text', placeholder: '请输入用户名' }"
        v-model="form.name"
        size="small"
      />
    </el-form-item>

    <!-- 人员选择器 (高级组件) -->
    <el-form-item label="负责人">
      <DynaForm
        :config="{ 
            type: 'personPicker', 
            multiple: true, 
            label: '选择人员',
            columns: [ // 表格列配置
                { prop: 'name', label: '姓名' },
                { prop: 'deptName', label: '部门' }
            ]
        }"
        v-model="form.managers"
        :options="deptTreeData"  
        :tableOptions="personListData"
        :total="100"
        @node-click="handleNodeClick"
        @page-change="handlePageChange"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import { DynaForm } from 'dyna-form';

export default {
  components: { DynaForm },
  data() {
    return {
      form: {
        name: '',
        managers: []
      },
      deptTreeData: [...], // 树形数据
      personListData: [...] // 列表数据
    };
  },
  methods: {
    handleNodeClick(data) { /* 处理树节点点击 */ },
    handlePageChange(pageParams) { /* 处理分页请求 */ }
  }
};
</script>
```

## 🛠 配置详解 (props.config)

`DynaForm` 接受一个 `config` 对象，根据 `type` 字段渲染不同组件。

### 通用属性

| 属性名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `type` | String | 组件类型 (`text`, `select`, `personPicker` 等) |
| `placeholder` | String | 占位符文本 |
| `disabled` | Boolean | 是否禁用 |
| `readonly` | Boolean | 是否只读 (仅 Text/DatePicker) |
| `tagColor` | String | 已选标签文字颜色 (Select/Cascader/TreeSelect) |
| `tagBackgroundColor` | String | 已选标签背景颜色 |

### 组件专属配置

#### `select` (ItemSelect)
| 属性名 | 描述 |
| :--- | :--- |
| `multiple` | 是否多选 |
| `limit` | 多选时最多显示的标签数 |
| `filterable` | 是否可搜索 |
| `allowCreate` | 是否允许创建新条目 |
| `valueField` / `labelField` | 自定义值/标签字段名 |

#### `selecttree` / `deptPicker` (ItemTreeSelectElement)
| 属性名 | 描述 |
| :--- | :--- |
| `checkStrictly` | 是否严格的父子不互相关联 |
| `disableBranchNodes` | 是否禁用分支节点（仅允许选叶子节点） |
| `multiple` | 是否多选 |

#### `personPicker` (ItemPersonPicker)
| 属性名 | 描述 |
| :--- | :--- |
| `multiple` | 是否多选 |
| `pageSize` | 每页显示数量 |
| `columns` | **(必填)** 表格列配置数组，如 `[{prop: 'name', label: 'Name'}]` |
| `childrenField` | 树结构子节点字段名 (默认 'children') |

## 💻 本地开发

本项目使用 Vue CLI 结构。

```bash
# 安装依赖
npm install

# 启动示例 (Demo)
npm run serve
```

## 📄 许可证

Apache-2.0
