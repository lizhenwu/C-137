import Vue from 'vue';
import toolTip from './tooltip';
const TooltipConstructor = Vue.extend(toolTip);

export default function(options) {
    options = options || {};
    const instance = new TooltipConstructor({data: options});
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    return instance.vm;
}