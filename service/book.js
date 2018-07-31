import request from './request'

export function getHotBook() {
  return request({
    api: `book/home`
  });
}

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


export function getAuthorBook (author) {
  return request({
    api: `book/author/${author}`
  });
}