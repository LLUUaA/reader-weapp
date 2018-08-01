// component/backTop/backTop.js
const SHOW_TOP = 300;

import { Throttle } from '../../utils/lib/index.js';

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    duration: {
      type: Number,
      value: 300
    },

    pageScroll: {
      type: null,
      value: null,
      observer: function(newVal, oldVal, changedPath) {
        if (newVal.scrollTop && newVal !== oldVal) {
          Throttle(this.handleScroll.bind(this, newVal.scrollTop));
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    backTop() {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: this.data.duration
      })

      this.setData({
        show:false
      })
    },

    handleScroll(scrollTop) {

      let show = scrollTop > SHOW_TOP;
      if (show && this.data.show) return;

      if (show) {
        this.setData({
          show: true
        })
      } else {
        this.setData({
          show: false
        })
      }
    }
  }
})