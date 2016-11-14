'use strict';

var Promise = require("bluebird");
var request =  Promise.promisify(require("request"));
var cheerio = require("cheerio");
var htmlAnalyse = require("../../htmlAnalyse/index.js").htmlAnalyse;
var config = require("./config.js").config;

/**
 * 获取收藏内容
 * @param {string} id   收藏页面id
 * @param {string} page 页码
*/
function GetCollection(id,page){
	if(!id) {
		console.log("你确定id输入了？")
		return false
	};
	var page = page || '';
	var zhihu = {
		url : config.collection+id,
		headers : config.headers
	};
	if(page) {
		zhihu.url = zhihu.url + '?page='+page;
	}
	
	return request(zhihu).then(function (content) {
		var $ = cheerio.load(content.body,{decodeEntities: false});
		var item = [];
		$(".zm-item").each(function(index,element){
			var body = htmlAnalyse($(element).find("textarea").text());
			var title = $(element).find(".zm-item-title a").text();
			var name = $(element).find(".zm-item-fav .zm-item-answer").data("created");
			item.push({
				body:body,
				title:title,
				name:name
			});
		});
		return item;
	});
};

/**
 * 获取当前收藏页面页码
 * @param {string} id 收藏页面id
 */
function GetCollectionPages(id){
	var zhihu = {
		url : config.collection+id,
		headers : config.headers
	};
	return request(zhihu).then(function (content){
		var $ = cheerio.load(content.body,{decodeEntities: false});
		var borderPagerNext = $(".border-pager").find("span");
		var pages = {
			first : borderPagerNext.eq(1).text(),
			last : borderPagerNext.eq(5).text()
		}
		return pages;
	})
}
module.exports = {
	GetCollection:GetCollection,
	GetCollectionPages:GetCollectionPages
}