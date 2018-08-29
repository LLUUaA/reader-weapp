

const BOOK_SHELF_KEY = 'bookShelfKey', MAX_BOOK_SHELF = 50;//BOOK_SHELF_KEY->key MAX_BOOK_SHELF->允许最大书架数量
import { 
  getBookShelf as getBookShelfSer,
  addBookShelf as addBookShelfSer 
  } from '../service/book.js';



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
 * @param {any} cb 
 * @desc 添加收藏
 */
export function addBookShelf(book, add = true, cb) {
  const checkBack = checkBook(book.bookId);
  let data = checkBack.data, status;

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
    status = 1;
  } else {
    //如果是移除
    data.splice(checkBack.index, 1);
    status = 0;
  }
  
  addBookShelfSer(
     [{
      bookId: book.bookId,
      bookInfo: book,
      status
    }]
  )

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
  return new Promise((resolve, reject) => {
    let bookList = [];
    bookList = wx.getStorageSync(BOOK_SHELF_KEY) || [];
    if (bookList.length) {
      resolve(bookList);
    }
    //获取服务器数据
    wx.showNavigationBarLoading();
    getBookShelfSer().then(res => {
      wx.hideNavigationBarLoading();
      let isDiff = false,//是否与本地不一致
        bookListService = [];//服务器的数据

      res.forEach((item, index) => {
        let bookInfo = JSON.parse(item.book_info);
        bookListService.push(bookInfo);
        if (!isDiff && bookList[index] && bookInfo.bookId != bookList[index].bookId) {
          isDiff = true;
        }
      });

      if (!bookListService.length && bookList.length) {
        //本地有数据服务器没有
        let data = [];
        resolve(bookList);
        bookList.forEach(item => {
          data.push({
            bookId: item.bookId,
            bookInfo: item,
            status: 1
          })
        })
        addBookShelfSer(data);

      } else if (bookListService.length && !bookList.length) {
        //本地没有数据服务器有
        resolve(bookListService);
        wx.setStorage({
          key: BOOK_SHELF_KEY,
          data: bookListService,
        })
      } else {
        isDiff = true;
      }
    })
      .catch(err => {
        wx.hideNavigationBarLoading();
      })
  })
}

/**
 * @desc 更新阅读章节
 */
export function updateChapter(bookId, readChapter) {
  const checkBack = checkBook(bookId);
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
