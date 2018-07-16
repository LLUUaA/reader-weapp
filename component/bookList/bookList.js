// component/bookList/bookList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookList: {
    type: Array,
    value: []
  },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toDetail(event){
      const { bookId } = event.target.dataset;
      wx.navigateTo({
        url: `../bookDetail/bookDetail?bookId=${bookId}`,
      })
    }
  }
})
