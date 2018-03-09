const isDev = process.env.NODE_ENV !== 'production';
module.exports = {
    defaultRoom: 'public',
    defaultAvatar: 'https://i.loli.net/2018/03/01/5a97b89dcd245.jpg',
    qiniu_accessKey: 'sRQ5EsJKSlsmHmkGQ5NWwUJ9f680BwPKxUqiUnfr',
    qiniu_secretKey: 'fvDIgcxkk8V4T75ofEci-0f86ELTuUdkyAomSWDl',
    qiniu_bucket: 'music',
    qiniu_domain: 'omuwxq7xd.bkt.clouddn.com',
    db: isDev ? 'test' : 'c137',
    db_account: isDev ? null : 'windmill',
    db_password: isDev ? null :'54321',
    jwt_expdays: 7
}