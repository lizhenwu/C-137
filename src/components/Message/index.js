import Vue from 'vue';
import Message from './message';
const MessageConstructor = Vue.extend(Message);

export default function (options) {
    options = options || {};
    let type = options.type || 'info',
        instance = new MessageConstructor({data: options});
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
}