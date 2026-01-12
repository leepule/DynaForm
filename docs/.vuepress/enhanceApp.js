import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import DynaForm from '../../src/DynaForm.vue';
import MultiPeriodPicker from '../../src/components/MultiPeriodPicker.vue';

export default ({
  Vue
}) => {
  Vue.use(ElementUI);
  Vue.component('DynaForm', DynaForm);
  Vue.component('MultiPeriodPicker', MultiPeriodPicker);
};
