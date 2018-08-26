//app.js
import { getConfig } from './service/other';

App({
  onLaunch: function () {
    this.getConfig();
  },


/**
 * @desc 获取配置文件
 */
  getConfig () {
    getConfig({
      name: 'gConfig2'
    })
      .then(res=>{
        this.gConfig = res;
      })
  },

/**
 * @desc 全局获取分享信息
 */
  getShareMsg(obj) {
    return Object.assign(obj, this.gConfig[obj.key] ? this.gConfig[obj.key].share : {})
  },
  gConfig:{},
  globalData: {
    userInfo: null,
    session: null,
  }
})