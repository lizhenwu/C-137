export default function timeFormat() {
        let toTimeString = function (timestamp) {
            let time = new Date(timestamp),
                hour = time.getHours(),
                minute = time.getMinutes();
            if(hour > 12) {
                return `下午 ${hour - 12}:${minute}`
            } else {
                return `上午 ${hour}:${minute}`
            }
        },
        toFullTimeString = function(timestamp) {
            let time = new Date(timestamp),
                year = time.getFullYear(),
                month = time.getMonth(),
                day = time.getDay(),
                hour = time.getHours(),
                minute = time.getMinutes();
            return year + '年' + month + '月' + day + '日' + ' ' + hour + ':' + minute;
        }
        return function(timestamp, timeOnly) {
            if(timeOnly) {
                return toTimeString(timestamp);
            }
            return toFullTimeString(timestamp)
        }
}