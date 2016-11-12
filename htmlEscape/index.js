'use strict';
var config = require("../htmlEscape/config.js").config;

var htmlEscape = function(value){
	if(!value) return console.log("没有内容");
	var content = new String();
	config.forEach(function(val){
		var pattern = val[0];
		var rep = new RegExp(pattern,'g');
		value = value.replace(rep,val[1]);
	})
	value = value.replace(/\/\/link.zhihu.com\/\?target=/g,'');
	value = value.replace(/target="_blank"/g,'');
	return value;

}// htmlEscape('//link.zhihu.com/?target=https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=1478163659&version=14&lang=zh_CN');
module.exports = {
	htmlEscape:htmlEscape
}