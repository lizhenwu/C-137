require('./models/db');
const koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');

const { router,routes } = require('./router');
const initIO = require('./socket');
const {errHandler} = require('./utils')

const app = new koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

app.env = process.env.NODE_ENV;

app.use(errHandler);
// login和signup路由排除jwt验证
app.use(jwt({ secret: 'windmill'}).unless({ path: [/^\/api\/login/], methos: 'put'}));

// 提供ctx.request.body或ctx.request.rawbody
app.use(bodyParser());

// koa错误处理
app.on('error',(err, ctx) => {
    if(err.status === 401) {
        ctx.status = 200;
        ctx.body = 'token验证失败'
    } else {
        ctx.status = 500;
        ctx.body = '服务器错误'
    }
})

// 路由
app
  .use(router.routes())
  .use(router.allowedMethods());

// socket服务器  
initIO(io);

// 开启服务
server.listen(8080, ()=>{
    console.log('listening 8080');
})
