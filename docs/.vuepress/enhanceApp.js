import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import * as DynaFormComponents from '../../src/index.js';
import FullDemo from '../../src/examples/FullDemo.vue';

export default ({
  Vue
}) => {
  Vue.use(ElementUI);
  
  // Register all components exported from src/index.js
  Object.keys(DynaFormComponents).forEach(name => {
    const component = DynaFormComponents[name];
    if (component && component.name) {
      Vue.component(component.name, component);
    }
  });
  
  // Also register DynaForm specifically if needed (though it's in the loop above)
  if (DynaFormComponents.DynaForm) {
    Vue.component('DynaForm', DynaFormComponents.DynaForm);
  }
  
  // Register FullDemo for documentation
  Vue.component('common-FullDemo', FullDemo);
  
  // Aliases for documentation compatibility
  if (DynaFormComponents.ItemQuarterWeekPicker) {
    Vue.component('MultiPeriodPicker', DynaFormComponents.ItemQuarterWeekPicker);
  }
};
