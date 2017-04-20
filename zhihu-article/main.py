# -*- coding: utf-8 -*-
import requests
import html2text
from bs4 import BeautifulSoup
import sys
import os
import codecs
import re


reload(sys)
sys.setdefaultencoding('utf-8')

url = raw_input('请输入url：')

# url = 'https://www.zhihu.com/question/54399502/answer/157595512'

def get_content_tite_id(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
        'Content-Type': 'text/html; charset=UTF-8',
        'method': 'GET',
        'Host': 'www.zhihu.com',
        'Pragma': 'no-cache',
        'Upgrade-Insecure-Requests': '1'
    }
    l = requests.get(url, headers=headers)
    content = l.text

    soup = BeautifulSoup(content, 'html.parser')

    title = soup.find_all("h1", class_="QuestionHeader-title")[0].text
    richText = soup.find_all("span", class_="CopyrightRichText-richText")[0].contents
    id = soup.find_all("div", class_="ContentItem")[0].get('name')

    body = html2text.html2text(str(''.join([line.encode('utf-8') for line in richText])))


    lists = {
        'title' : title,
        'id' : id,
        'content' : body
    }
    return lists

def subn_content(text):
    config = [
        ['&quot;', '"'],
        ['&amp;', '&'],
        ['&lt;', '<'],
        ['&gt;', '>'],
        ['&lt', '<'],
        ['&gt', '>'],
        ['&nbsp;', ' '],
        ['&amp;', '&'],
        ['%3A', ':'],
        ['%3F', '?'],
        ['%3D', '='],
        ['%26', '&'],
        ['\\sdata-rawwidth=".*?"', ''],
        ['\\sdata-rawheight=".*?"', ''],
        ['\\/\\/link.zhihu.com\\/\\?target=', ''],
        ['\\starget="_blank"', ''],
        ['\\sclass=".*?"', ''],
        ['\\n', '<br />'],
        ['\\swidth=".*?"', ''],
        ['\\srel=".*?"', ''],
        ['\\sdata-original=".*?"', ''],
        ['\/\/zhstatic.zhihu.com/','https://zhstatic.zhihu.com/']
    ]
    ch = ''

    for i in config:
        ch = re.sub(r''+i[0],i[1],text)

    return ch


md = get_content_tite_id(url)

path = os.path.abspath('')

with codecs.open(path+'/'+md['title']+md['id']+'.md','w','utf-8') as f:
    f.write(subn_content(md['content']))
    print '成功'