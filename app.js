const koa = require('koa');
const path = require('path');
import webpack from 'webpack';
import {devMiddleware} from 'koa-webpack-middleware';
import devConfig from './webpack.config.js';
const fs = require('fs');
const staticMid = require('koa-static');
const compile = webpack(devConfig);

const app = new koa();
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const staticPath = path.resolve(__dirname,'dist');
// app.use(staticMid(staticPath));
app.use(devMiddleware(compile,{
    publicPath:'/',
    stats:{
        colors:true
    },
    headers: { "X-Custom-Header": "yes" },
}));


function readFile(path){
    return new Promise((resolve,reject)=>{
        fs.readFile(path,'utf8',(err,data)=>{
            if(err) reject(err);
            resolve(data);
        })
    })
}
app.use(async(ctx)=>{
    // let html = await readFile(path.join(__dirname,'dist/index.html'));
    ctx.body = `<!DOCTYPE html>
<html lang="en">
    <head>
        <title>test</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui" />
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/mdui/0.2.1/css/mdui.min.css">
    </head>
    <body class="mdui-theme-primary-indigo">
        <div id="app">
           
        </div>
        <!--<script type="text/javascript" src="lib/js/mdui.min.js"></script>-->
        <script type="text/javascript" src="/bundle.js"></script>
    </body>
</html>`;
    // console.log(html);
  });
const users=[];

io.on('connection',(socket)=>{
    console.log(socket.name)
    socket.on('namein',(name)=>{
        socket.name = name;
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
    socket.emit('notice','on');
    // console.log(socket.id);
    
})

server.listen(3000,()=>{
    console.log('listening 3000');
})
