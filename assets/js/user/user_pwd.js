$(function() {
    var form = layui.form

    form.verify({
            pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
            samePwd: function(value) {
                if (value === $("[name=oldPwd]").val()) {
                    return "新旧密码不能相同！"
                }
            },
            rePwd: function(value) {
                if (value !== $("[name=newPwd]").val()) {
                    return "两次密码不一致！"
                }
            }
        })
        // 重置密码功能
    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message + "，更新密码失败！")
                }
                layui.layer.msg("更新密码成功！")
                    // 转换为原生，调用原生的form.reset方法，重置表单
                $(".layui-form")[0].reset()
                window.parent.localStorage.removeItem('token')

                window.parent.location.href = '../login.html'

            }
        })
    })
})