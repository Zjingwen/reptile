'use strict';

var zhihu = require("zhihu"),
	Question = require("zhihu").Question,
	Collection = require("zhihu").Collection;

var htmlEscape = require("../htmlEscape/index.js").htmlEscape;

var fs = require("fs"),
	Thenjs = require('thenjs');

var readline = require('readline');


// zhihu.User.info(User.name).then(function(user){
// 	console.log(user);
// });

/**
 * 读取知乎收藏文件夹
 */
function cllection(gurl){
	Collection.getPagination(gurl).then(function(info){
		console.log('当前收藏一共：'+info.pages+'页');
		return info;
	}).then(function(index){
		var i = 1;
		var time = function(){
			setTimeout(function(){
				collection (i++,gurl);
				if ( i <= index.pages ) time();
			},1000);
		}
		time();
	});

	function collection (index,url){
		var url = url+'?page='+index;
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
		fs.open('../data/'+value+'.md','w',function(err,data){
			if(err){
				console.log("文件创建失败");
				return false;
			}
		})
		fs.writeFile('../data/'+value+'.md',content,function(err,data){
			if(err){
				console.log("文件写入失败");
				return console.error(err);
			}
			console.log(value+".md"+"-----文件写入成功");
		})
	}
}
module.exports = {
	cllection:cllection
}
