import env from './env';
import getSession from './account.js';
export default (options, needSession = true) => {
  return new Promise((resolve, reject) => {
    const excuteRequest = (session) => {
      options = Object.assign({
        url: env.host,
        api: '',
        data: {},
        method: 'GET',
        success: (res) => {
          // console.log(options, res);
          if (res.statusCode === 401) {
            reject(res.data);
            const app = getApp();
            app.globalData.session = null;
            return;
          }

          if (res.data.code === -1) {
            reject(res.data);
            return;
          }

          resolve(res.data)
        },
        fail: reject,
        header: {
          Authorization: session ? `SessionKey ${session}` : ''
        }
      }, options)
      options.url = options.url + options.api;
      wx.request(options)
    }

    if (needSession) {
      getSession()
        .then(session => {
          excuteRequest(session);
        })
    } else {
      excuteRequest();
    }
  })
}