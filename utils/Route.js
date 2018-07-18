module.exports={
  // 可扩展为任意页面
  /**
   * @param page = discover
   */
  Route(opts){
    opts=Object.assign({
      pageSign:'isIndexPage',
      toUrl: '../index/index',
      isIndex: false,//是否是 redirectTo
    },opts);

    let currentPages = getCurrentPages(),
      currentLength = currentPages.length,
      currentIdex;//主页所在index
    for (let i = 0; i < currentLength; i++) {
      if (currentPages[i][opts.pageSign]) {
        currentIdex = i + 1;
        break;
      }
    }

    if (currentLength > 1 && currentIdex) {
      //如果length>1 &&currentIdex存在首页则 back 否则  redirectTo
      wx.navigateBack({
        delta: currentLength - currentIdex
      });
    } else if (opts.isIndex) {
      wx.redirectTo({
        url: opts.toUrl,
      })
    }else{
      wx.navigateTo({
        url: opts.toUrl,
      })
    }
  },

  Back(){
    let currentPages = getCurrentPages(),
      currentLength = currentPages.length;
      if(currentLength>1){
        wx.navigateBack()
      }else{
        wx.redirectTo({
          url: '../index/index',
        })
      }
  },

}