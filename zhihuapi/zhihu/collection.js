'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var cheerio = require('cheerio')
var htmlAnalyse = require('../../htmlAnalyse/index.js').htmlAnalyse
var config = require('./config.js').config

/**
 * 获取收藏内容
 * @param {string} id   收藏页面id
 * @param {string} page 页码
*/
function GetCollection (id, page) {
  if (!id) {
    console.log('你确定id输入了？')
    return false
  }
  page = page || ''
  var zhihu = {
    url: config.collection + id,
    headers: config.headers
  }
  if (page) {
    zhihu.url = zhihu.url + '?page=' + page
  }

  function addTitle (title, body) {
    var content = '<h1>' + title + '</h1>' + body
    return content
  }

  return request(zhihu).then(function (content) {
    var $ = cheerio.load(content.body, {decodeEntities: false})
    var item = []
    $('.zm-item').each(function (index, element) {
      /**
       * 判断当前类型
       * @type {
       * type == Answer 当前为回答
       * type == Post   当前为专题
       * }
       */
      var type = $(element).data('type')
      /**
       * 判断当前问题有没有被和谐
       * @type {bool}
       */
      var deleteAswer = Boolean($(element).find('#answer-status').html())
      var title, body, name

      if (deleteAswer) {
        title = '「被和谐了」' + $(element).find('.zm-item-title a').text()
        body = addTitle(title, htmlAnalyse($(element).find('#answer-status').text()))
        name = $(element).find('.zm-item-fav .zm-item-answer').data('created')
      } else {
        if (type === 'Answer') {
          title = $(element).find('.zm-item-title a').text()
          body = addTitle(title, htmlAnalyse($(element).find('.zm-item-fav .zm-item-answer .content').text()))
          name = $(element).find('.zm-item-fav .zm-item-answer').data('created')
        }

        if (type === 'Post') {
          title = $(element).find('.zm-item-title a').text()
          body = addTitle(title, htmlAnalyse($(element).find('.zm-item-fav .zm-item-post .content').text()))
          name = $(element).find('.zm-item-fav meta[itemprop=post-url-token]').attr('content')
        }
      }

      item.push({
        body: body,
        title: title,
        name: name
      })
    })
    return item
  })
}

/**
 * 获取当前收藏页面页码
 * @param {string} id 收藏页面id
 */
function GetCollectionPages (id) {
  var zhihu = {
    url: config.collection + id,
    headers: config.headers
  }
  return request(zhihu).then(function (content) {
    var $ = cheerio.load(content.body, {decodeEntities: false})

    if ($('.error').html()) {
      console.log('当前收藏不存在')
      return false
    }
    var borderPagerNext = $('.border-pager').find('span')
    var pages = {
      first: borderPagerNext.eq(1).text(),
      last: borderPagerNext.eq(5).text()
    }
    return pages
  })
}
module.exports = {
  GetCollection: GetCollection,
  GetCollectionPages: GetCollectionPages
}
