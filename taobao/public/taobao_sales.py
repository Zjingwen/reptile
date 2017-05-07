# -*- coding:utf-8 -*-
 
# 通过手淘爬取淘宝销量数据
from bs4 import BeautifulSoup
import requests 
import sys
import re
import json

reload(sys)
sys.setdefaultencoding('utf-8')

def main(url):
	r = requests.post(url)
	bs = BeautifulSoup(r.text,'html5lib')
	data_mdskip = bs.find_all('script')[7].contents
	data_mdskip = re.sub(r'var _DATA_Mdskip =  ','',data_mdskip[0])
	data_mdskip = json.loads(data_mdskip)

	print data_mdskip['defaultModel']['sellCountDO']['sellCount']

if __name__ == "__main__":
	main('https://detail.m.tmall.com/item.htm?id=540219887479')
