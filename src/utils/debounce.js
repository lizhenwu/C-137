export default function debounce(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      result = func.apply(context, args);
    };

    var debounced = function(...args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        // bind对参数的处理类似call
        timeout = setTimeout(later.bind(this, this, ...args), wait);
      }

      return result;
    };

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };