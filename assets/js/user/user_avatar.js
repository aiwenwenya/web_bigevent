$(function() {
    var layer = layui.layer
        // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)
        // 点击上传按钮选择图片
    $("#btnChooseImage").on('click', function() {
            $("#file").click()
        })
        // 为文件选择框绑定change事件
    $("#file").on('change', function(e) {
            // 获取用户选择的文件
            var filelist = e.target.files
            if (filelist.length === 0) {
                return layer.msg("请选择图片！")
            }
            // 获取用户选择的照片
            var file = e.target.files[0]
                // 将获取到的图片转化为URL地址
            var newImgURL = URL.createObjectURL(file)
                // 重新渲染画面
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 为确定绑定点击事件
    $("#btnUpLoad").on('click', function() {
        // 拿到用户上传的图片
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
            // 调用接口上传头像
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg("更新头像成功！")
                    // 重新渲染用户头像
                window.parent.getUserInfo()
            }
        })
    })
})