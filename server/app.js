const koa = require('koa');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const {router,routes} = require('./router');
const User = require('./db'); 
const fs = require('fs');

const app = new koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

app.use(bodyParser());
// app.use(mongo(null,pool));

function readFile(path){
    return new Promise((resolve,reject)=>{
        fs.readFile(path,'utf8',(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}

function signup(ctx,info){
    return new Promise((resolve,reject)=>{
        let user = ctx.mongo.db('test').collection('users').findOne({name:info.name});
        user.then((value)=>{
            if(value){
                console.log(value);
                resolve('user exist');
            }else{
                info.status = 'on';
                ctx.mongo.db('test').collection('users').insert(info).then(()=>{
                    ctx.cookies.set('name',Buffer.from(info.name).toString('base64'),{maxAge:1000*60,secure:false,httpOnly:true});
                    resolve('sucess to signup');
                });
            };
        })
    })
}
function login(ctx,info){
    return new Promise((resolve,reject)=>{
        ctx.mongo.db('test').collection('users').findOne({name:info.name}).then((value)=>{
        if(!value){
            resolve('error1');
        }else if(value.password == info.password){
            if(value.status == 'on'){
                resolve('error1')
            }else {
                ctx.mongo.db('test').collection('users').updateOne({name:info.name},{$set:{status:'on'}},(err,result)=>{
                    console.log(result.result.n)
                });
                ctx.cookies.set('name',Buffer.from(info.name).toString('base64'),{maxAge:1000*60*60*2,secure:false,httpOnly:true});
                resolve('yes');
            }
        }else{
            resolve('wrong password');
        }
    },(err)=>{
        console.log(err);
    })
    })
}
// 登录
router.post(routes.login,async(ctx,next)=>{
    //登录验证
    //User.find()在数据库中查询密码是否有这个用户名
    // 没有 -> 返回前端提示注册
    // 有 -> 如果在线 -> 
    //       不在线 -> 修改状态为在线 -> 登录成功
    // 应该把当前用户doc传递下去
    let userInfo = JSON.parse(ctx.request.rawBody);
    let feedback=await login(ctx,userInfo);
    console.log(feedback);
    ctx.response.status = 200;
    ctx.response.body = feedback;
}) 
// 用户
router.get(routes.user,async(ctx,next)=>{
    // 查询上次离线时间
    // Msg.find({time > lastTime})
    // 向用户推送上次离开之后的消息
    let user = ctx.cookies.get('name');
    if(user){
        ctx.response.status = 200;
        ctx.response.body = {user:Buffer.from(user,'base64').toString(),state:true};
    }else{
        ctx.response.status = 401;
    }
})
router.get(routes.logout,async(ctx,naxt)=>{
    // 修改当前用户状态为
    // User.findOneAndUpdate({state: false,lastTime: now})
    // 从服务端断开socket,发送disconnect ？
    const userName = ctx.cookies.get('name');
    ctx.mongo.db('test').collection('users').updateOne({name:userName},{$set:{status:'off'}},(err,result)=>{
        console.log(result.result.n);
    });
    ctx.cookies.set('name');
    ctx.response.status = 200;
    ctx.response.body = "log out success";    
})
router.post(routes.signup,async(ctx,next)=>{
    let userInfo = JSON.parse(ctx.request.rawBody);
    let feedBack = await signup(ctx,userInfo);
    ctx.response.status = 200;
    ctx.response.body = feedBack;
    console.log(ctx.request.path,feedBack);
})
app
  .use(router.routes())
  .use(router.allowedMethods());
const users=[];

io.on('connection',(socket)=>{
    socket.emit('notice','on');  
    socket.on('namein',(name)=>{
        console.log(socket.name);
        socket.name = name;
        pool.acquire().then((mongo)=>{
            mongo.db('test').collection('users').updateOne({name:socket.name},{$set:{status:'on'}});
            pool.release(mongo);
        }).catch(err=>{
            throw err;
        })
        users.push({name:name});
        // console.log(users);
        io.of('/').clients((err,clients)=>{
        if(err) throw err;
        io.emit('num',{counts:clients.length,users:users});
        // console.log(clients.length);
       });
    });
    socket.on('send',(data)=>{
        console.log(data);
        socket.broadcast.emit('text',data);
    });
    socket.on('disconnect',()=>{
        // 前端关闭的退出，数据库操作退出
        pool.acquire().then((mongo)=>{
            mongo.db('test').collection('users').updateOne({name:socket.name},{$set:{status:'off'}});
            pool.release(mongo);
        }).catch(err=>{
            throw err;
        })
        console.log(socket.name);
        let i = users.findIndex((ele)=>{
            return ele.name == socket.name;
        });
        users.splice(i,1);
        // console.log('索引值：'+i);
        io.of('/').clients((err,clients)=>{
        if(err) throw err;
        io.emit('num',{counts:clients.length,users:users});
        // console.log(users);
       });
    });  
})

server.listen(3000,()=>{
    console.log('listening 3000');
})
