$(function() {
    var layer = layui.layer
    var form = layui.form
    getArtCateList()
        // 获取文章的分类列表
    function getArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {

                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
            }
        })
    }
    var indexAdd = null
        // 为添加类别绑定点击事件
    $("#btnAddCate").on('click', function() {

        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $("#dialog-add").html(),
            area: ['500px', '250px']
        });
        // 通过代理的方式给form-add表单添加提交事件
        $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
                // 发起Ajax请求
            $.ajax({
                method: "POST",
                url: "/my/article/addcates",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("添加文章失败！")
                    }
                    // 重新获取文章列表
                    getArtCateList()
                    layer.msg("添加文章成功！")
                        // 关闭弹出层
                    layer.close(indexAdd)
                }
            })
        })
    })
    var indexEdit = null
        // 通过代理的形式为btn-edit绑定点击事件
    $("tbody").on('click', '.btn-edit', function(e) {
            e.preventDefault()
            indexEdit = layer.open({
                type: 1,
                title: '修改文章分类',
                content: $("#dialog-edit").html(),
                area: ['500px', '250px']
            });
            var id = $(this).attr('data-id')
                // 发起请求
            $.ajax({
                method: "GET",
                url: "/my/article/cates/" + id,
                success: function(res) {
                    form.val('form-edit', res.data)
                }
            })
        })
        // 通过代理的形式给修改分类表单绑定提交事件
    $("body").on('submit', '#form-edit', function(e) {
            e.preventDefault()
            $.ajax({
                method: "POST",
                url: "/my/article/updatecate",
                data: $(this).serialize(),
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("更新文章信息失败！")
                    }
                    layer.msg("更新文章信息成功！")
                    layer.close(indexEdit)
                    getArtCateList()
                }
            })
        })
        // 通过代理的形式为删除按钮绑定点击事件
    $("tbody").on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        layer.confirm('确认删除？?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除文章分类失败！")
                    }
                    layer.msg("删除文章分类成功！")
                    layer.close(index);
                    // 重新获取文章列表
                    getArtCateList()
                }
            })

        });
    })
})