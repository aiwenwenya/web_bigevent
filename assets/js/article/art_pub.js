$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
        // 初始化富文本编辑器
    initEditor()
        // 定义获取文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！")
                }
                // 调用模板引擎渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)
                    //  一定要调用layui的form.render()方法
                form.render()
            }
        })
    }
    // 裁剪图片区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
        // 为选择封面绑定点击事件
    $("#btnChooseImage").on('click', function() {
            $("#coverfile").click()
        })
        // 为coverfile绑定change事件
    $("#coverfile").on('change', function(e) {
            // 获取到用户选择的文件
            var files = e.target.files
                //  判断用户是否选择了文件
            if (files.length === 0) {
                return layer.msg('请选择图片！')
            }
            // 根据文件创建URL地址
            var newImgURL = URL.createObjectURL(files[0])
                // 为裁剪区重新设置图片
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        })
        // 定义文章的状态
    var art_state = '已发布'
        // 为存为草稿绑定点击事件
    $("#btnSave2").on('click', function() {
            art_state = '草稿'

        })
        // 为表单绑定submit事件
    $("#form-pub").on('submit', function(e) {
            e.preventDefault()
                // 利用formdata快速创建基于form的表单
            var fd = new FormData($(this)[0])
                // 把文章的发布状态存到fd中
            fd.append('state', art_state)
                // 将裁剪后的区域输出一个对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 将文件对象存到fd中
                    fd.append("cover_img", blob)
                        // 发起ajax请求
                    publishActicle(fd)
                })

        })
        // 定义发表文章的方法
    function publishActicle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            // 如果提交的是FormData格式,注意必须添加一下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败！")
                }
                layer.msg("发布文章成功！")
                    // 跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})