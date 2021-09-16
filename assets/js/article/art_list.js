$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(data) {
            const dt = new Date(data)
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义查询对象，当发起请求时需要提交到服务器
    var q = {
        pagenum: 1, //页码值，默认为1
        pagesize: 2, //每页显示几条数据，默认显示2条
        cate_id: "", //文章分类的 Id
        state: "", //文章的状态，可选值有：已发布、草稿
    }
    getTable()
    initCate()
        // 获取文章的列表数据
    function getTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章列表失败！")
                }
                // layer.msg("获取文章列表成功！")
                // console.log(res);
                // 通过模板引擎渲染数据
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
                    // 调用分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类列表失败！")
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)

                $("[name=cate_id]").html(htmlStr)
                    // 让layui重新渲染下拉菜单
                form.render()
            }
        })
    }
    // 为筛选表单标定submit事件
    $("#form-search").on('submit', function(e) {
            e.preventDefault()
                // 获取表单中选中项的值
            var cate_id = $("[name=cate_id]").val()
            var state = $("[name=state]").val()
                // 为查询对象q的属性赋值
            q.cate_id = cate_id
            q.state = state
                // 根据最新的筛选条件，重新渲染表格的数据
            getTable()
        })
        // 定义渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: "pageBox", //分页id
            count: total, //数据总条数
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //起始页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 触发jump的回调方式有两种
            // 1.点击页码的时候，会触发fist是undefined
            // 2.只要调用了laypage.render()方法就会触发first是true
            jump: function(obj, first) {
                // console.log(obj.curr);
                // 把最新的页码值赋值给p.pagenum
                q.pagenum = obj.curr
                    // 把最新的条目数赋值给q.pagesize
                q.pagesize = obj.limit
                    // 当first为undefined时调用 getTable()
                if (!first) {
                    getTable()
                }
            }
        })
    }

    // 通过代理的方式为删除按钮绑定点击操作
    $("tbody").on('click', '.btn-delete', function() {
        // 获取删除按钮的个数
        var len = $(".btn-delete").length
            // console.log(len);
            // 获取文章的id
        var id = $(this).attr('data-id')
            // 询问是否删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)

                    }
                    layer.msg("删除文章成功！")
                        // 当删除数据后判断此页是否有数据，如果没有就-1，再重新渲染
                    if (len === 1) {
                        // 当len=1时，删除成功后-1，最小值是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    getTable()
                }
            })
            layer.close(index);
        });
    })
})