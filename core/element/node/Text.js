/**
 * Created by qiyc on 2017/2/7.
 */
Text.prototype=require("./Node.js");
module.exports = Text;
var defaults =function(){
    return {
        position:[0,0],
        font:{
            size:16,
            type: '微软雅黑',
            color:"255,255,255"
        },
        zIndex: 200,//层级(10-999)
        alpha: 1,
        text: 'no text here',
        type: 'text'
    };
};
//一般节点
function Text(config) {
    var self = this;
    self.attr = QTopo.util.extend(defaults(), config || {});
    self.jtopo = new JTopo.TextNode();
    //封装对象之间相互保持引用
    self.jtopo.qtopo=self;
    //函数
    self.set = setJTopo;
    //初始化
    self.set(self.attr);
}
function setJTopo(config) {
    if (config) {
        var self=this;
        //处理一般属性的设置
        self._setNode(config,["text"]);
        //处理特殊属性的设置
    }
}
//私有函数