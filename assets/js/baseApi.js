$.ajaxPrefilter(function(options) {
    // 当发起Ajax请求时会先访调用ajaxPrefilter函数
    // 统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        // 统一为有权限的接口配置 headers 请求头对象
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载complete回调
    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
                // 强制跳转到登录页
            location.href = 'login.html'
        }
    }

})