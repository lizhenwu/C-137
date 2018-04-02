import Vue from 'vue';
import Vuex from 'vuex';
import io from 'socket.io-client';
Vue.use(Vuex);
// 创建socket实例
const CREATE_SOCKET = 'CREATE_SOCKET';
const UPDATE_ONLINEUSERS = 'UPDATE_ONLINEUSERS';
const EMIT_NEWMSG = 'EMIT_NEWMSG';
const EVENT_REGISTE = 'EVENT_REGISTE';
const INIT_USER_DATA = 'INIT_USER_DATA';
const CHANGE_ROOM = 'CHANGE_ROOM';
const START_LOADING = 'START_LOADING';
const STOP_LOADING = 'STOP_LOADING';
const ADD_NEW_MSG = 'ADD_NEW_MSG';
const LEAVE_ROOM = 'LEAVE_ROOM';
const ENTER_ROOM = 'ENTER_ROOM';
const CHANGE_AVATAR = 'CHANGE_AVATAR';
const domain = process.env.NODE_ENV === 'production' ? location.origin : 'http://localhost:8080';

const store = new Vuex.Store({
    state: {
        user: localStorage.user,
        token: localStorage.token,
        loadingPosition: '',
        online: false,
        socket: null,
        logedIn: false,
        avatar: null,
        rooms: [],
        insideRoom: false,
        currentRoomIdx: undefined,
        // onlineUsers应该是包含用户数据对象的数组
        // 对象数据结构为{nickName: '',avatar: ''},可能会加入更多
        onlineUsers: []
    },
    getters: {
        roomData: state => {
            if(state.currentRoomIdx != undefined) {
                return Object.assign(
                    state.rooms[state.currentRoomIdx].roomData, 
                    {name: state.rooms[state.currentRoomIdx].name}
                )
            } else {
                return {}
            }
        },
        currentMsgArr: (state, getters) => {
            return getters.roomData.msgs || []
        }
    },
    mutations: {
        // 登录之后创建socket实例
        // 在App组件中通过socketInit提交此mutation
        [CREATE_SOCKET](state) {
            // 前后端分离，后端监听的是8080端口
            let socket = io(domain, {autoConnect: false});
            state.socket = socket.open();
        },
        // 更新在线用户数据，nickName数组
        [UPDATE_ONLINEUSERS](state,data) {
            data = Array.isArray(data) ? data : [data];
            state.onlineUsers.push(...data);
        },
        [EVENT_REGISTE](state,event) {
            state.socket.on(event.eventType, event.handler)
        },
        [INIT_USER_DATA](state, data) {
            state.user = data.nickName;
            state.avatar = data.avatar;
            state.rooms = data.rooms.map(item => ({
                name: item.name, 
                entered: false, 
                roomData: {msgs: [], notice: ''}
            }))
        },
        [LEAVE_ROOM](state) {
            state.insideRoom = false;
        },
        [ENTER_ROOM](state) {
            state.insideRoom = true;
        },
        [CHANGE_ROOM](state, data) {
            if(!state.rooms[data.idx].entered) {
                state.rooms[data.idx].entered = true;
                state.rooms[data.idx].roomData.notice = data.roomData.notice;
            }
            state.currentRoomIdx = data.idx;
        },
        [CHANGE_AVATAR](state, data) {
            state.avatar = data
        },
        [START_LOADING](state, position) {
            state.loadingPosition = position;
        },
        [STOP_LOADING](state) {
            state.loadingPosition = '';
        },
        [ADD_NEW_MSG](state, data) {
            let msgArr = Array.isArray(data.msg) ? data.msg : [data.msg],
                idx;
            if(state.currentRoomIdx && data.roomName === state.rooms[state.currentRoomIdx].name) {
                idx = state.currentRoomIdx;
            }else {
                idx = state.rooms.findIndex(i => i.name === data.roomName);
            }
            let msgs = state.rooms[idx].roomData.msgs;
            if(!msgs.length) {
                return msgs.push(...msgArr);
            }
            if(msgArr.length === 1) {
                if(msgArr[0].time <= msgs[0].time) {
                    return msgs.unshift(msgArr[0]);
                }
                return msgs.push(msgArr[0]);
            }
            return msgs.unshift(...msgArr);
        },
        login(state) {
            state.user = localStorage.user,
            state.token = localStorage.token,
            state.logedIn = true
        }
    },
    actions: {
        // 用户登录后初始化socket
        socketInit({commit,state}) {
            commit(CREATE_SOCKET);
            // 异步更新在线用户数据
            // emit包含一个函数参数，后端响应后以后端响应的数据为参数执行
            // 用户登录后获取当前在线用户数据（一个数组）

            // 进入home页时向后端发出login消息和用户已加入的房间列表
            // 在后端把socket分配到这些房间内
            state.socket.emit('login', {
                user: state.user, 
                userRooms: state.rooms.map(i => i.name),
                avatar: state.avatar
            }, function(data) {
                console.log(data)
            });
            // 给当前用户注册新加入用户后更新在线用户数据的监听器
            commit(EVENT_REGISTE,{
                eventType: 'user in',
                handler: function(data) {
                    if(data.nickName === state.user) return;
                    commit(UPDATE_ONLINEUSERS, data);
                    Vue.prototype.$notify({message: `${data.nickName}上线了`});
                }
            })
            commit(EVENT_REGISTE,{
                eventType: 'user out',
                handler: function(data) {
                    if(data.nickName === state.user) return;
                    let index = state.onlineUsers.findIndex(user => user.nickName === data.nickName);
                    state.onlineUsers.splice(index,1);
                    Vue.prototype.$notify({message: `${data.nickName}下线了`});
                }
            })
            commit(EVENT_REGISTE, {
                eventType: 'new msg',
                handler: function(data) {
                    commit(ADD_NEW_MSG, data)
                }
            })
        },
        joinRoom({commit, state}, roomName) {
            commit(START_LOADING);
            state.socket.emit('join room', roomName, function(data) {
                state.insideRoom = true;
                commit(CHANGE_ROOM, data);
                commit(STOP_LOADING);
            })
            commit(EVENT_REGISTE, {
                eventType: 'user in',
                handler: function(data) {
                
                }
            })
        }
    }
})

export default store;