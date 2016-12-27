'use strict'

var Promise = require('bluebird')
var request = Promise.promisify(require('request'))
var cheerio = require('cheerio')
var html = require('../../html/main.js')
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
  // page = page || ''

  var zhihu = {
    url: config.collection + id,
    headers: config.headers
  }

  // if (page) {
  zhihu.url = zhihu.url + '?page=' + page
  // }

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
      var orgin = {}

      if (deleteAswer) {
        orgin.title = '「被和谐了」' + $(element).find('.zm-item-title a').text()
        orgin.body = addTitle(orgin.title, html($(element).find('#answer-status').text()))
        orgin.key = $(element).find('.zm-item-fav .zm-item-answer').data('created')
      } else {
        if (type === 'Answer') {
          orgin.title = $(element).find('.zm-item-title a').text()
          orgin.body = addTitle(orgin.title, html($(element).find('.zm-item-fav .zm-item-answer .content').text()))
          orgin.key = $(element).find('.zm-item-fav .zm-item-answer').data('created')
        }
        if (type === 'Post') {
          orgin.title = $(element).find('.zm-item-title a').text()
          orgin.body = addTitle(orgin.title, html($(element).find('.zm-item-fav .zm-item-post .content').text()))
          orgin.key = $(element).find('.zm-item-fav meta[itemprop=post-url-token]').attr('content')
        }
      }

      item.push(orgin)
    })

    return item
  })
}

/**
 * 将标题和key拼接在一起，让同一个回答的收藏可以保存
 * @param {string} title 辩题
 * @param {int} key   标示
 */
function addTitle (title, key) {
  var content = '<h1>' + title + '</h1>' + key
  return content
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
