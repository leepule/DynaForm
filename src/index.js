import DynaForm from './DynaForm.vue';
import ItemText from './items/ItemText.vue';
import ItemNumber from './items/ItemNumber.vue';
import ItemSelect from './items/ItemSelect.vue';
import ItemDatePicker from './items/ItemDatePicker.vue';
import ItemCascader from './items/ItemCascader.vue';
import ItemTreeSelectElement from './items/ItemTreeSelectElement.vue';
import ItemPersonPicker from './items/ItemPersonPicker.vue';
import MultiPeriodPicker from './components/MultiPeriodPicker.vue';

const components = [
    DynaForm,
    ItemText,
    ItemNumber,
    ItemSelect,
    ItemDatePicker,
    ItemCascader,
    ItemTreeSelectElement,
    ItemPersonPicker,
    MultiPeriodPicker
];

// 定义 install 方法
const install = function (Vue) {
    if (install.installed) return;
    components.forEach(component => {
        Vue.component(component.name, component);
    });
};

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

export {
    DynaForm,
    ItemText,
    ItemNumber,
    ItemSelect,
    ItemDatePicker,
    ItemCascader,
    ItemTreeSelectElement,
    ItemPersonPicker,
    MultiPeriodPicker
};

export default {
    install
};
