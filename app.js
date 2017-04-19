'use strict'
/**
 * TODO 下个版本1.2.0添加功能
 * 不重复保存已保存的收藏
 * 如果该收藏被删除，提示用户
 * 在网络状态差的情况下，重新请求
 * 介绍页面弄一下
 */
var zhihu = require('./zhihuapi/api.js').zhihu
var fs = require('fs')
var readline = require('readline')

/**
 * [rl 命令行输入框]
 */
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
rl.question('知乎收藏id是多少？', function (answer) {
  console.log('收藏ID是' + answer)
  console.log('正在开始，不要慌张！！！！')
  GetCollectionList(answer)
  // test id 42474270
  rl.close()
})

/**
 * 获取当前页数，并且调取保存
 * @param {int} id 当前专题id
 */
function GetCollectionList (id) {
  zhihu.GetCollectionPages(id).then(function (pages) {
    if (!pages) return false
    console.log('当前收藏共计：' + pages.last + '页')
    GetCollection(id, pages.first, pages.last)
  })
}

/**
 * 读取知乎收藏夹
 * @param  {string} id   收藏的id
 * @param  {string} page 当前页码
 */
function GetCollection (id, pagefirst, pagelast) {
  var page = pagefirst
  zhihu.GetCollection(id, page).then(function (value) {
    console.log('----- 第' + page + '页已获取 -----')
    return value
  }).then(function (value) {
    value.forEach(function (value) {
      // value 包含 {title,body,key}
      io(value)
    })
    setTimeout(function () {
      if (page < pagelast) {
        ++page
        GetCollection(id, page, pagelast)
      }
    }, 450)
  })
}

/**
 * 存储文件
 * @param  {object} value {包含title\body\key}
 */
function io (value) {
  var title = value.title
  var body = value.body
  var key = value.key

  fs.open('zhihu/' + title + key + '.md', 'w', function (err, data) {
    if (err) {
      console.log('文件创建失败')
      return false
    }
    fs.writeFile('zhihu/' + title + key + '.md', body, function (err) {
      if (err) {
        console.log('文件写入失败')
        return console.error(err)
      }
      console.log(title + '.md' + '-----文件写入成功')
      fs.close(data, function (err) {
        if (err) {
          console.log('文件关闭失败')
          return console.error(err)
        }
      })
    })
  })
}
