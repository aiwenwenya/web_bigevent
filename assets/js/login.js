$(function() {
    // 点击去注册账号的链接
    $("#link_reg").on('click', function() {
            $(".login-box").hide()
            $(".reg-box").show()
        })
        // 点击去登录的链接
    $("#link_login").on('click', function() {
            $(".login-box").show()
            $(".reg-box").hide()
        })
        // 从layui中获取相关的对象
    var form = layui.form
    var layer = layui.layer
        // 通过form.verify自定义验证规则
    form.verify({
            // 自定义密码框的验证规则
            pwd: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            // 定义确认密码的规则
            repwd: function(value) {
                var pwd = $(".reg-box [name=password]").val()
                if (pwd !== value) {

                    return "两次输入密码不一致！"

                }
            }
        })
        // 监听表单的注册事件
    $("#form_reg").on('submit', function(e) {
            // 阻止表单的默认提交
            e.preventDefault()
            var data = {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val()

            }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录！')
                    // 注册成功后跳转到登录页面
                $("#link_login").click()
            })
        })
        // 监听表单的登录事件
    $("#form_login").submit(function(e) {
        // 阻止默认的提交行为
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                    // 把登录成功的token值存储
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = 'index.html'

            }
        })
    })
})