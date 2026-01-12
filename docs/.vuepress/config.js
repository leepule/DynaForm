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
          title: '组件列表',
          collapsable: false,
          children: [
            'text',
            'number',
            'select',
            'date-picker',
            'cascader',
            'tree-select',
            'person-picker',
            'multi-period-picker'
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
