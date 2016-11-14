var config = {
	collection : 'https://www.zhihu.com/collection/',
	headers : {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
		'Content-Type': 'text/html; charset=UTF-8',
		'method': 'GET',
		'Host': 'www.zhihu.com',
		'Pragma': 'no-cache',
		'Upgrade-Insecure-Requests':'1'
	},
	timeout: 500
};
module.exports={
	config:config
}