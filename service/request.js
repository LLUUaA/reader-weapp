import env from './env';


export default (options) => {
  return new Promise((resolve, reject) => {
    options = Object.assign({
      url: env.host,
      api: '',
      data: {},
      method: 'GET',
      success: (res) => {
        if (res.data.code === -1) {
          reject(res.data);
        } else {
          resolve(res.data)
        }
      },
      fail: reject,
      header: {
      }
    }, options)

    options.url = options.url + options.api
    wx.request(options)
  })
}