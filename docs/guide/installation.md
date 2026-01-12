# 安装

## 环境要求

- Vue 2.6+
- Element UI 2.15+

## 安装步骤

推荐使用 npm 或 yarn 进行安装。

```bash
# npm
npm install dyna-form

# yarn
yarn add dyna-form
```

### 依赖项 (Peer Dependencies)

本项目依赖 `element-ui` 以及 `sass` 预处理器，请确保你的项目中已安装：

```bash
npm install element-ui sass sass-loader
```

## 全局注册

在项目的入口文件（通常是 `main.js`）中引入并注册：

```javascript
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 全局注册所有组件
import DynaForm from 'dyna-form';
Vue.use(DynaForm);
```

### 按需引入 (On-Demand Import)

你可以只引入需要的组件，以减小打包体积：

```javascript
import { DynaForm, ItemSelect } from 'dyna-form';

export default {
    components: {
        DynaForm,
        ItemSelect
    }
}
```
