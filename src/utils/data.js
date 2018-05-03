const states = {
        'online': '#43b581',
        'nodisturb': '#f04747',
        'hidden': '#747f8d'
    },
    stateOrigin = {
        user: localStorage.user,
        token: localStorage.token,
        loadingPosition: '',
        online: false,
        socket: null,
        logedIn: false,
        avatar: null,
        rooms: [],
        currentState: 'online',
        insideRoom: false,
        currentRoomIdx: undefined,
        // onlineUsers应该是包含用户数据对象的数组
        // 对象数据结构为{nickName: '',avatar: ''},可能会加入更多
        onlineUsers: [],
        previousUsers: [],
        siderBarCollapsed: false
    };

export {
    states,
    stateOrigin
}