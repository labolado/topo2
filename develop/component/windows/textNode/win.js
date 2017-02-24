/**
 * Created by qiyc on 2017/2/20.
 */
var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:main
};
var defaultAttr={
    text:"",
    fontColor:"255,255,255",
    fontSize:20
};
/**
 * 初始化文字节点的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function main(dom, scene){
    var win=$(temp);
    //注册窗口打开和关闭事件
    initEvent(dom,win);
    //基本窗口属性初始化
    util.initBase(dom,win);
    //颜色选择框初始化
    util.initColorSelect(win);
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        doWithForm(win.todo,scene,data);
        win.close();
    });
    return win;
}
function initEvent(dom,win){
    win.on("window.open",function(e,data){
        if(data){
            switch (data.type){
                case "create":
                    openCreateWindow(win,data.position);
                    break;
                case "edit":
                    openEditWindow(win,data.target);
                    break;
                default:
                    console.error("invalid type of textNodeWindow,open function need to config like { type:'create' or 'edit'}");
                    if(win.todo){
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        }else{
            console.error("invalid open textNodeWindow");
        }
        util.defaultPosition(dom,win);
        win.show();
    });
    win.on("window.close",function(e,data){
        win.hide();
    });
}
function doWithForm(config, scene, data){
    if(config){
        switch (config.type){
            case "create":
                scene.createNode({
                    type:"text",
                    position:config.position,
                    text:data.text,
                    font:{
                        color:data.fontColor,
                        size:data.fontSize
                    }
                });
                break;
            case "edit":
                if(config.target&&config.target.getUseType()==QTopo.constant.node.TEXT){
                    config.target.set({
                        text:data.text,
                        font:{
                            color:data.fontColor,
                            size:data.fontSize
                        }
                    });
                }
                break;
        }
    }
}
function openCreateWindow(win, position){
    if(!position){
        console.error("invalid open textNodeWindow,need set position to create");
    }
    win.todo={
        type:"create",
        position:position
    };
    util.setFormInput(win.find("form"),defaultAttr)
}
function openEditWindow(win, target){
    if(!target){
        console.error("invalid open textNodeWindow,need set target to edit");
    }
    win.todo={
        type:"edit",
        target:target
    };
    var attr=target.attr;
    util.setFormInput(win.find("form"),{
        text:attr.text,
        fontColor:attr.font.color,
        fontSize:attr.font.size
    });
}