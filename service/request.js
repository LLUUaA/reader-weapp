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
          if (res.data.code === -1) {
            reject(res.data);
          } else {
            resolve(res.data)
          }
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
        .then(session=>{
          excuteRequest(session);
        })
    } else {
      excuteRequest();
    }
  })
}