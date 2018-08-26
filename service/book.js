import request from './request'

// 获取首页书架
export function getBookShelf() {
  return request({
    api: `book/bookshelf`
  });
}

//添加书籍
export function addBookShelf(data) {
  return request({
    api: `book/bookshelf`,
    data,
    method:'post'
  });
}

//获取热门书籍
export function getHotBook() {
   return request({
    api: `book/home`
  });
}

//获取书籍
export function getBook(bookId,onlyBookInfo=true) {
  return request({
    api: `book/chapter/${bookId}`,
    data:{
      onlyBookInfo
    }
  });
}

/**
 * @function {*} readBook
 * @param {Number} bookId 
 * @param {Number} chapterNum 
 */
export function readBook(bookId, chapterNum = 1) {
  return request({
    api: `book/chapter/details/${bookId}/${chapterNum}`
  });
}


/**
 * @function searchBook
 * @param {Object} data //request data
 */
export function searchBook(data) {
  data = Object.assign({
    pageIndex: 1
  }, data);
  return request({
    api: `book/search/${data.keyword}`,
    data: data
  });
}

/**
 * @param {Number} bookId 
 * @param {Number} pageIndex 
 */
export function getChapterList(bookId, pageIndex = 1) {
  return request({
    api: `book/chapter/other/${bookId}/${pageIndex}`
  });
}

export function getBookType (type){
  return request({
    api: `book${type}`
  });
}

//获取作者相关书籍
export function getAuthorBook (author) {
  return request({
    api: `book/author/${author}`
  });
}

//阅读章节记录
export function chapterRecor(data) {
  return request({
    api: `book/chapter/record`,
    data,
    method:'post'
  });
}

//获取上一次阅读的位置（没有加入书架时）
export function getLastRead(bookId) {
  return request({
    api: `book/lastRead`,
    data:{
      bookId: bookId
    }
  });
}