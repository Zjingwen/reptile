'use strict';

var zhihu = require("./requests/api.js").zhihu;
var fs = require("fs");

var readline = require('readline');

/**
 * [rl 命令行输入框]
 */
/*var  rl = readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

rl.question("知乎专题id是多少？",function(answer){
    console.log("专题ID是"+answer);
    // 不加close，则不会结束
    var User = {
		name : "jing-wen-zhou",
		collection:{
			url:"https://www.zhihu.com/collection/"+answer
		}
	}
    collectionFun(User);
    rl.close();
});*/

function collection(id,page){
	var page = ++page;
	zhihu.GetCollection(id,page).then(function(value){
		console.log("----- 第"+page+"页已获取 -----");
		return value;
	}).then(function(value){
		value.forEach(function(value){
			var item = {
				title:value.title,
				content:value.body
			};
			io(item.title,item.content);
		})
		setTimeout(function() {
			if(value[0]) collection(id,page);
		},500);
	});
}
function io(title,content){
	fs.open('zhihu/'+title+'.md','w',function(err,data){
		if(err){
			console.log("文件创建失败");
			return false;
		}
	})
	fs.writeFile('zhihu/'+title+'.md',content,function(err,data){
		if(err){
			console.log("文件写入失败");
			return console.error(err);
		}
		console.log(title+".md"+"-----文件写入成功");
	})
}

collection('42474270',0);