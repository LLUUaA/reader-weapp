import request from './request'

// export default {
//     /**
//      * @function searchBook
//      * @param {Object} data //request data
//      */
//     searchBook(data) {
//         data = Object.assign({
//             pageIndex: 1
//         }, data);
//         return request({
//             api: `book/search/${data.keyword}`,
//             data: data
//         });
//     },

//     /**
//      * @function getBook
//      * @param {Number} bookId 
//      */
//     getBook(bookId){
//         return request({
//             api: `book/chapter/${bookId}`
//         });
//     },

//     getHotBook(){

//     },

//     /**
//      * @function {*} readBook
//      * @param {Number} bookId 
//      * @param {Number} chapterNum 
//      */
//     readBook(bookId,chapterNum=1){
//         return request({
//             api: `book/chapter/details/${bookId}/${chapterNum}`
//         });
//     },

//     /**
//      * 
//      * @param {Number} bookId 
//      * @param {Number} pageIndex 
//      */
//     getChapterList(bookId,pageIndex=1){
//         return request({
//             api: `book/chapter/other/${bookId}/${pageIndex}`
//         });
//     }
// }

export function getHotBook() {
  return request({
    api: `book/home`
  });
}

export function getBook(bookId) {
  return request({
    api: `book/chapter/${bookId}`
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