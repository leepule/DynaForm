import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import FullDemo from '../src/examples/FullDemo.vue';

Vue.use(ElementUI);

new Vue({
    render: h => h(FullDemo)
}).$mount('#app');
