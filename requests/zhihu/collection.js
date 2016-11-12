var Promise = require("bluebird");
var request =  Promise.promisify(require("request"));
var cheerio = require("cheerio");
var htmlAnalyse = require("../../htmlAnalyse/index.js").htmlAnalyse;

function GetCollection (id,page){
	if(!id) {
		console.log("你确定id输入了？")
		return false
	};
	var page = page || '';
	var zhihu = {
		url : 'https://www.zhihu.com/collection/'+id,
		headers : {
			'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
			'Content-Type': 'text/html; charset=UTF-8',
			'method': 'POST',
			'Host': 'www.zhihu.com',
			'Pragma': 'no-cache',
			'Upgrade-Insecure-Requests':'1'
		}
	};
	if(page) {
		zhihu.url = zhihu.url + '?page='+page;
		zhihu.headers.Referer = zhihu.url + '?page='+page;
	}

	return request(zhihu).then(function (content) {
		var $ = cheerio.load(content.body,{decodeEntities: false});
		var item = [];
		$(".zm-item").each(function(index,element){
			var body = htmlAnalyse($(element).find("textarea").text());
			var title = $(element).find(".zm-item-title a").text();
			item.push({
				body:body,
				title:title
			});
		});
		return item;
	});
};
module.exports = {
	GetCollection:GetCollection
}