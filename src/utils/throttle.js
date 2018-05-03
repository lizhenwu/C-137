export default function(fn, wait) {
    let first = true, timer;
    return function throttled() {
        let ctx = this, args = arguments;
        if(first) {
            first = false;
            return fn.apply(ctx, args);
        }
        if(timer) {
            return;
        }
        timer = setTimeout(function() {
            fn.apply(ctx, args);
            clearTimeout(timer);
            timer = null;
        }, wait)
    }
}