/**
 * Created by Administrator on 2017/2/17 0017.
 */
require("./toolBar.css");
var toolBar = require("./toolBar.html");
var selectResult = require("./selectResult.html");
module.exports = {
    init: init
};
function init(instance, windows) {
    var dom = instance.document;
    var scene = instance.scene;
    var wrap = $(dom).find(".qtopo-toolBar");
    if (wrap.length == 0) {
        wrap = $("<div class='qtopo-toolBar'></div>");
        $(dom).append(wrap);
    }
    toolBar = $(toolBar);
    editBar = toolBar.find(".edit-children");
    selectResult = $(selectResult).hide();
    wrap.append(toolBar);
    wrap.append(selectResult);
    wrap.find("[data-toggle*='tooltip']").tooltip();//开启提示框
    //切换模式和子菜单栏显示位置
    wrap.find("[name=topo_mode]").click(function (e) {
        var mode = $(this).find("input").val();
        scene.setMode(mode);
        if (mode == "normal") {
            editBar.show();
        } else {
            editBar.hide();
        }
    });
    //居中展示
    toolBar.find("button[name=center]").click(function () {
        scene.goCenter();
    });
    //还原正常比例
    toolBar.find("button[name=common]").click(function () {
        scene.resize(1);
    });
    //鼠标缩放
    toolBar.find("button[name=zoom_checkbox]").click(function () {
        scene.toggleZoom();
    });
    //鹰眼
    toolBar.find("button[name=eagle_eye]").click(function () {
        scene.toggleEagleEye();
    });
    //导出png
    toolBar.find("button[name=export_image]").click(function () {
        scene.getPicture();
    });
    //自动布局
    editBar.find("button[name=auto_layout]").click(function () {
        windows.windows.autoLayout.open();
    });
    var addSearch = addSearchMode(instance, scene, toolBar, selectResult);
    addSearch({
        type: "value",
        name: "default(同层)",
        hideResult:false,
        search: function (val) {
            return scene.find(val, "node")
                .map(function(i){
                    return {
                        content: i.attr.name,
                        target:i
                    }
                });
        },
        clickResult:function(result){
            if(result.target){
                scene.moveToNode(result.target);
            }
        }
    });
    function doSave(fn) {
        if ($.isFunction(fn)) {
            toolBar.find("button[name=save]").click(fn);
        }
    }

    return {
        addSearch: addSearch,
        save: doSave
    };
}
/**
 * 添加搜索模块
 * @param instance
 * @param scene
 * @param toolBar
 * @param resultWin 搜索结果展示区
 * @returns {Function}返回添加搜索方式的接口
 */
function addSearchMode(instance, scene, toolBar, resultWin) {
    var resultSelect = resultWin.find(".result-select");
    var resultShow = resultWin.find(".result-show");
    var selectWin = toolBar.find("select[name=search_mode]");
    var searchBtn = toolBar.find("button[name=search]");
    var input = toolBar.find("input[name=search_value]");
    var clear = toolBar.find(".clear-input");
    selectWin.data("searchMode", {});
    clear.hide();
    clear.click(function () {
        input.val("");
        clear.hide();
        resultWin.hide();
    });
    input.keydown(function (e) {
        if (e.keyCode == 13) {
            doSearch();
        }
        clear.show();
    });
    searchBtn.click(function () {
        doSearch();
    });
    resultSelect.click(function () {
        resultShow.toggle();
    });
    resultShow.click(function(e){
        if(e.target){
            $(e.target).data("doResult")();
        }
    });
    function doSearch() {
        var searchConfig=selectWin.data("searchMode")[selectWin.val()];
        if ($.isFunction(searchConfig.search)) {
            var results=searchConfig.search(input.val());
            if(!searchConfig.hideResult){
                addResult(results,searchConfig.clickResult);
            }
        }
    }

    function addResult(results,click) {
        if ($.isArray(results)) {
            resultShow.empty();
            $.each(results, function (i, result) {
                var li = $("<li title='" + result.content + "'>" + result.content + "</li>")
                    .data('doResult',function(){
                        if($.isFunction(click)){
                            click(result);
                        }
                    });
                resultShow.append(li);
            });
            resultWin.show();
        }
    }

    return function (search) {
        if ($.isArray(search)) {
            search.map(function (i) {
                addSearch(i);
            });
        } else {
            addSearch(search);
        }

        return instance;
        function addSearch(config) {
            if (config) {
                selectWin.data("searchMode")[config.type] = config;
                selectWin.prepend("<option value='" + config.type + "'>" + config.name || config.type + "</option>");
            }
        }
    }
}