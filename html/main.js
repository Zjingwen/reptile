'use strict'
var toMarkdown = require('to-markdown')

var config = [
  ['&quot;', '"'],
  ['&amp;', '&'],
  ['&lt;', '<'],
  ['&gt;', '>'],
  ['&nbsp;', ' '],
  ['&amp;', '&'],
  ['%3A', ':'],
  ['%3F', '?'],
  ['%3D', '='],
  ['%26', '&']
]

var html = function (value) {
  if (!value) {
    console.log('没有内容')
    return false
  }
  config.forEach(function (val) {
    var pattern = val[0]
    var rep = new RegExp(pattern, 'g')
    value = value.replace(rep, val[1])
  })

  value = value.replace(/\/\/link.zhihu.com\/\?target=/g, '')
  value = value.replace(/\starget="_blank"/g, '')
  value = value.replace(/\sclass=".*?"/g, '')
  value = value.replace(/\srel=".*?"/g, '')
  value = value.replace(/\n/g, '<br />')
  value = value.replace(/\sdata-original=".*?"/g, '')
  value = value.replace(/\sdata-rawwidth=".*?"/g, '')
  value = value.replace(/\sdata-rawheight=".*?"/g, '')
  value = value.replace(/\sdata-rawwidth=".*?"/g, '')
  value = value.replace(/\swidth=".*?"/g, '')

  return value
}
module.exports = html
