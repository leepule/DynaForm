const path = require('path');

module.exports = {
  title: 'DynaForm',
  description: 'DynaForm - 基于 Element UI 的数据驱动型表单组件库',
  base: '/DynaForm/',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '组件', link: '/components/text' },
      { text: 'GitHub', link: 'https://github.com/your-repo' }
    ],
    sidebar: {
      '/guide/': [
        {
          title: '入门',
          collapsable: false,
          children: [
            'installation',
            'quickstart'
          ]
        }
      ],
      '/components/': [
        {
          title: '基础组件',
          collapsable: false,
          children: [
            'text',
            'number',
            'select',
            'switch',
            'date-picker'
          ]
        },
        {
          title: '高级组件',
          collapsable: false,
          children: [
            'cascader',
            'tree-select',
            'person-picker',
            'quarter-week-picker'
          ]
        },
        {
          title: '示例展示',
          collapsable: false,
          children: [
            'full-demo'
          ]
        }
      ]
    }
  },
  chainWebpack: (config) => {
    // Alias @ to src directory
    config.resolve.alias.set('@', path.resolve(__dirname, '../../src'));

    // Ensure babel processes the src directory
    config.module
      .rule('js')
      .include.add(path.resolve(__dirname, '../../src'))
      .end();
  }
};
