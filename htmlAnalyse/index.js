'use strict'

var config = require('../htmlAnalyse/config.js').config

var htmlAnalyse = function (value) {
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
  value = value.replace(/target="_blank"/g, '')
  value = value.replace(/class=".*?"/g, '')
  value = value.replace(/rel=".*?"/g, '')
  value = value.replace(/\n/g, '<br />')
  value = value.replace(/data-original=".*?"/g, '')
  value = value.replace(/data-rawwidth=".*?"/g, '')
  value = value.replace(/data-rawheight=".*?"/g, '')
  value = value.replace(/data-rawwidth=".*?"/g, '')
  value = value.replace(/width=".*?"/g, '')

  return value
}
module.exports = {
  htmlAnalyse: htmlAnalyse
}
