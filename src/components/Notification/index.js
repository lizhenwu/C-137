import Vue from 'vue';
import notification from './notification';
const NotificationConstructor = Vue.extend(notification);

let instances = [],
    idx = 0;

function renderNotice(options) {
    options = options || {};
    options.onClose = function(id) {
        renderNotice.close(id);
    };
    let instance = new NotificationConstructor({data: options});
    instance.vm = instance.$mount();
    // instance.vm.id = idx++;
    document.body.appendChild(instance.vm.$el);
    instance.vm.visible = true;
    instance.dom = instance.vm.$el;
    if(instances.length > 0) {
        let offsetHeight;
        instances.forEach(instance => {
            offsetHeight += instance.vm.$el.offsetHeight + 16
        });
        instance.vm.positionValue = offsetHeight;
    }
    instances.push(instance);
    instance.vm.id = instances.length - 1;
    // 可以通过返回的这个实例异步地改变它的数据，是响应式的，可以用来做发送成功后改变消息显示效果的功能
    return instance.vm;
}
renderNotice.close = function(id) {
    instances.splice(id, 1);
}

export default renderNotice;