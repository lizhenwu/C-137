import loading from './loading';
import Vue from 'vue';

const LoadingConstructor = Vue.extend(loading);
LoadingConstructor.prototype.close = function() {
    if(!this.$el.parentNode) return;
    this.vm = this.$el.parentNode.removeChild(this.vm);
}
export default function startLoading(ref) {
    let ctx = this.$refs[ref] || document.body;
    let l = this._loading || (this._loading = new LoadingConstructor());
    l.vm = l.vm || l.$mount().$el;
    ctx.appendChild(l.vm);
    return l;
}