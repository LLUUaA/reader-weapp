import env from './env';


export default (options) => {
  return new Promise((resolve, reject) => {
    options = Object.assign({
      url: env.host,
      api: '',
      data: {},
      method: 'GET',
      success: (res)=>{
        resolve(res.data)
      },
      fail: reject,
      header: {
      }
    }, options)

    options.url = options.url + options.api
    wx.request(options)

    // .then(res => {
    //     if(res.statusCode===200){
    //         // ...do something
    //     }
    //     resolve(res.data);
    // }, err => {
    //     reject(err);
    // })
  })
}