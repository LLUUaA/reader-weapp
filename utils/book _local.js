// 使用本地存储
const BOOK_SHELF_KEY = 'bookShelfKey', MAX_BOOK_SHELF = 50;//BOOK_SHELF_KEY->key MAX_BOOK_SHELF->允许最大书架数量
import { chapterRecor } from '../service/book.js';

/**
 * @function checkBook
 * @param {number} bookId --bookId
 * @param {boolean} backData --是否返回data
 * @desc 检查是否加入书架
 * @returns object
 */
function checkBook(bookId, backData = true) {
  let data = wx.getStorageSync(BOOK_SHELF_KEY) || [],
    isExist = false, index = null, readChapter = null;

  /**
   * @desc 这里可以采用两种方法存。
   *       1.以bookId作为key -> 方便判断是否保存,缺点：读取慢
   *       2.直接push ->读取速度快，缺点：每次新增、删除需要遍历查重
   */
  data.forEach((item, idx) => {
    if (item && item.bookId == bookId) {
      isExist = true;
      index = idx;
      readChapter = item.readChapter;
    };
  })

  if (backData) {
    return { isExist, index, data, readChapter }
  } else {
    return { isExist, index, readChapter }
  }
}

/**
 * @param {Object} book
 * @param {boolean} add --默认添加书架
 * @desc 添加收藏
 */
export function addBookShelf(book, add = true, cb) {
  const checkBack = checkBook(book.bookId);
  let data = checkBack.data;

  if (add && data.length > MAX_BOOK_SHELF) {
    wx.showToast({
      title: '最多加入' + MAX_BOOK_SHELF + '本书',
      icon: 'none'
    })
    return;
  }

  if (checkBack.isExist === add) return;//判断 return 

  if (add) {
    //如果是添加
    data.unshift(book);
  } else {
    //如果是移除
    data.splice(checkBack.index, 1);
  }
  wx.setStorage({
    key: BOOK_SHELF_KEY,
    data,
  })

  if (cb && "function" === typeof cb) cb();
}


/**
 * @param {number} bookId
 * @desc 检查是否加入书架
 * @returns boolean
 */
export function checkBookShelf(bookId) {
  return checkBook(bookId);
}

/**
 * @desc 获取已加入书架的书籍
 * @returns array
 */
export function getAddBookShelf() {
  return wx.getStorageSync(BOOK_SHELF_KEY) || [];
}

/**
 * @desc 更新阅读章节
 */
export function updateChapter(bookId, readChapter) {
  const checkBack = checkBook(bookId);
  chapterRecor({
    id: bookId,
    num: readChapter
  })
  if (checkBack.isExist&&checkBack.index >= 0) {
    //如果index存在说明已加入书架
    let data = checkBack.data;
    data[checkBack.index].readChapter = readChapter;

    wx.setStorage({
      key: BOOK_SHELF_KEY,
      data,
    })
  }
}
