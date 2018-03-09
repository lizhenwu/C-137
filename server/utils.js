const Config = require('./config');
const qiniu = require('qiniu');
const mac = new qiniu.auth.digest.Mac(Config.qiniu_accessKey, Config.qiniu_secretKey);
const bucket = Config.qiniu_bucket;
const options = {
    scope: bucket,
};
const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z0;

module.exports = {
    /**
     * 返回promise给async
     * resolve的是图片链接，不包含协议头
     * @param {String} key 
     * @param {String} baseCode 
     */
    uploadAvatar(key, baseCode) {
        let data = Buffer.from(baseCode.replace(/^data:image\/(jpeg|gif|jpg|png);base64,/, ''), 'base64'),
            putPolicy = new qiniu.rs.PutPolicy(options),
            uploadToken=putPolicy.uploadToken(mac),
            formUploader = new qiniu.form_up.FormUploader(config),
            putExtra = new qiniu.form_up.PutExtra();
        return new Promise((resolve, reject) => {
            formUploader.put(uploadToken, key, data, putExtra, function(respErr,
                respBody, respInfo) {
                if (respErr) {
                  reject(respErr);
                }
                if (respInfo.statusCode == 200) {
                  resolve(Config.qiniu_domain + '/' + respBody.key);
                } else {
                  resolve({statusCode: respInfo.statusCode,respBody});
                }
            });
        })
    },

    /**
     * 错误处理中间件
     * @param {*} ctx 
     * @param {*} next 
     */
    async errHandler(ctx, next) {
        try{
            await next()
        }catch(err) {
            if(err.statusCode === 401) {
                ctx.response.body = 'token过时失效';
            }
            ctx.response.status = err.statusCode || err.status || 500;
            ctx.app.emit('error', err, ctx);
        }
    }
}