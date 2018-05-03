import Loading from '../components/loadingIndex';

export default {
    loading: {
        install: function(Vue) {
            Vue.prototype.$loading = Loading;
        }
    }
}