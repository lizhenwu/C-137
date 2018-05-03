const regForName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/gi;
const regForPwd = /^[a-zA-Z0-9.*]{5,12}$/gi;
export default function(name, pwd, ctx) {
    
    if(name.search(regForName) === -1) {
      return ctx.$message({
        type: 'info',
        message: '用户名由2到8位字母数字汉字下划线组成'
      })
    }
    if(pwd.search(regForPwd) === -1) {
      return ctx.$message({
        type: 'info',
        message: '密码由5到12位字母数字.*组成'
      })
    }
    return true;
  }