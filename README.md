# C-137

vue2全家桶打造的即时聊天室SPA，目前还未完工，但已经可以使用基本功能，线上地址[c137.zwait.cc](https://c137.zwait.cc)，UI部分参照了[Discord](https://discordapp.com/invite/HBherRA),后端部分借鉴过[NAMI](https://github.com/redsx/NAMI)，向他们表示感谢

> C-137是[《瑞克和莫蒂》](https://movie.douban.com/subject/11537954/)中主人公Rick来自的次元在宇宙中的代号

## 功能
- [ ] 创建房间
- [ ] sideBar中房间列表上显示消息提示
- [ ] 永久退出房间
- [x] 在home页能看到所有在线用户
- [ ] 可以选择向别人显示或隐藏当前所在房间
- [ ] 在房间内时显示当前房间内所有用户
- [ ] 设置消息接收状态
- [x] ~~上传头像~~，改昵称
- [ ] 房间列表分为已加入的房间和未加入的房间以及默认的公共房间
- [ ] 房间创建者可以选择是否让未加入此房间的用户看到聊天记录， 但一定要加入才能发言
- [ ] 进入某个还未加入的房间时输入框不可用
- [ ] 登录后已加入的房间就开始接收消息，未加入的房间需要点击加入后才接收消息
- [ ] 在home页时已加入的房间可以接收消息， 点击进入房间后只显示收到的消息，在提示上点击选择显示下线期间错过的消息
- [ ] 显示消息发送状态


房间类型： 

- [x] 公共房间： 仅一个，成员是所有用户，登录即接收消息
- [ ] 普通房间:  显示在列表中但需要加入才能成为成员并开始接收消息, 可选择是否需要密码才能加入
- [ ] 私密房间： 不显示在列表中， 只能以邀请的方式加入

## note

edge浏览器flex子元素高度和chrome里的实现不一样

Array.protptype.includes是es7的方法

[element的Notification](https://github.com/ElemeFE/element/blob/dev/packages/notification/src/main.js)为什么是在外部声明的instance，而不是在调用‘构造函数’时声明instance(为了只声明一次？)

notice生成频率高时不能有效地从instaces中splice掉

上传文件
```html
<input type="file" name="file">
<!-- 多个文件要加上multiple属性 -->
<!-- 用ele.files获取文件，单个文件就是ele.files[0] -->
```

flex元素单独设置主轴对齐方式
```css
flex-grow: 1;   // 只有它在有空余空间时可伸缩，也就是它占据了所有剩余空间
display: flex;  // 将它设置为flex,就可以单独对他进行主轴右对齐
justify-content: flex-end;
```
绝对定位元素居中的一个方法
```css
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0; 
    margin: auto;
```

## 近期todo

1. ~~welcome页背景~~
2. ~~所有字体~~
3. CSS响应式
4. 创建新房间
5. 全局less变量单独写一个文件,引入webpack.config,怎么在vue组件文件中使用
6. 查找成员
7. 更改在线状态 
8. ~~webpack打包，三个四个配置文件~~
9. ~~生产环境版本使用cdn上的iconfont而非本地文件~~
10. CSS冗余
11. PC端多开
12. 多终端同步

## 使用

```sh
git clone https://github.com/lizhenwu/C-137.git

cd C-137

npm install
```
### dev 

```sh
npm run server

npm run build:dll

npm run dev
```
### dist

```sh
npm run dist
```
