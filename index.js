'use strict';

var zhihu = require("zhihu"),
	Question = require("zhihu").Question,
	Collection = require("zhihu").Collection;

var htmlEscape = require("./htmlEscape/index.js").htmlEscape;

var fs = require("fs"),
	Thenjs = require('thenjs');

var readline = require('readline');

// var User = {
// 	name : "jing-wen-zhou",
// 	collection:{
// 		url:"https://www.zhihu.com/collection/42474270"
// 	}
// }

/**
 * 读取知乎收藏文件夹
 */
var  rl = readline.createInterface({
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
});

function collectionFun(User){
	console.log("正在爬取");
	Collection.getPagination(User.collection.url).then(function(info){
		console.log('当前收藏一共：'+info.pages+'页');
		return info;
	}).then(function(index){
		var i = 1;
		var time = function(){
			setTimeout(function(){
				collection (i++);
				if ( i <= index.pages ) time();
			},1000);
		}
		time();
	});

	function collection (index){
		var url = User.collection.url+'?page='+index;
		Collection.getDataByPage(url).then(function(info){
			return info
		}).then(function(value){
			value.forEach(function(value){
				value.content = htmlEscape(value.content);
				var item = {
					title:value.question.title,
					content:value.content
				}
				io(item.title,item.content);
			})
		});
	}

	function io(value,content){
		fs.open('data/'+value+'.md','w',function(err,data){
			if(err){
				console.log("文件创建失败");
				return false;
			}
		})
		fs.writeFile('data/'+value+'.md',content,function(err,data){
			if(err){
				console.log("文件写入失败");
				return console.error(err);
			}
			console.log(value+".md"+"-----文件写入成功");
		})
	}
}
