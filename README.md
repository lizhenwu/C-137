# chatX
vue聊天室

- 创建房间
- 加入某个房间后即使在home页也能在sideBar看到房间列表上的消息提示
- 永久退出房间
- 在home页能看到所有在线用户
- 可以选择向别人显示或隐藏当前所在房间
- 在房间内时显示当前房间内所有用户
- 设置消息接收状态
- ~~上传头像~~，改昵称
- 房间列表分为已加入的房间和未加入的房间以及默认的公共房间
- 房间创建者可以选择是否让未加入此房间的用户看到聊天记录， 但一定要加入才能发言
- 进入某个还未加入的房间时输入框不可用
- 登录后已加入的房间就开始接收消息，未加入的房间需要点击加入后才接收消息
- 在home页时已加入的房间可以接收消息， 点击进入房间后只显示收到的消息，在提示上选择显示下线期间错过的消息

把loading组件在需要的位置都写一个(因为目前仅需两个)，在state里加入loadingPosition变量，用在v-if中决定是否显示以及显示在哪个位置,要改成命令式插入的形式......

- 用户发送一条新消息后在前端直接加入消息列表并显示(自带一个颜色动画类)，后端反馈发送成功后去掉它的动画类

房间类型： 

- 公共房间： 仅一个，成员是所有用户，登录即接收消息
- 普通房间:  显示在列表中但需要加入才能成为成员并开始接收消息, 可选择是否需要密码才能加入
- 私密房间： 不显示在列表中， 只能以邀请的方式加入

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

## todo

1. welcome页背景
2. 所有字体
3. CSS响应式
4. 创建新房间
5. 全局less变量单独写一个文件,引入webpack.config,怎么在vue组件文件中使用
6. 查找成员
7. 更改在线状态 
8. webpack打包，三个两个配置文件
9. 生产环境版本使用cdn上的iconfont而非本地文件
10. CSS冗余