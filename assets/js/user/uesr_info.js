$(function() {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // nickname 验证
        nickname: function(value) {
            if (value.length > 6) {
                return "昵称长度必须在1~6个字符之间！"
            }
        }
    })
    initUserInfo()
        // 初始化用户信息
    function initUserInfo() {

        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！")
                }
                // console.log(res.data.username);
                // 调用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data)


            }
        })
    }

    // 重置表单数据
    $("#btnReset").on('click', function(e) {
            // 阻止默认的重置行为
            e.preventDefault()
                // 重新渲染表单数据
            initUserInfo()
        })
        // 监听表单的提交事件
    $(".layui-form").on('submit', function(e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
            // 发起Ajax请求
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败！")
                }
                layer.msg("更新用户信息成功！")
                    // 调用父页面的方法重新渲染用户的昵称和头像
                window.parent.getUserInfo()
            }
        })
    })
})