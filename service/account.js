import request from './request';
let observer = { } ,loginStatus ,count=0;

function wxLogin() {
  return new Promise((resolve,reject)=>{
    const app = getApp();
    wx.login({
      success: (login) => {
        request({
          api: `account/wxLogin`,
          data: { code: login.code },
          method: 'post'
        }, false)
          .then(res => {
            app.globalData.session = res.session;
            if (observer) {
              backSession(app.globalData.session);
            }
            resolve(app.globalData.session);
          }, err => {
            reject(err);
          })
      },
    })
  })
}

function backSession(session) {
  for (let i in observer) {
    observer[i](session);
  }
  observer = [];
}

function Listen() {
  let self = this;
  self.callback = (name='session',data) =>{
    let callbackSymbol = 'on' + name.substr(0, 1).toUpperCase() + name.substr(1);
    if (callbackSymbol in self) {
      self[callbackSymbol](data);
    }
  }
}
// observer = new Listen();

 export default () => {
  return new Promise((resolve, reject) => {
    const app = getApp();
    if (!app.globalData.session) {
      let key;
      count++;
      if (!loginStatus) {
          wxLogin();
          loginStatus = true;
        }
        observer[Date.parse(new Date())+count] = function (session) {
          resolve(session);
          loginStatus = false;
          count = 0;
        }
    } else {
      resolve(app.globalData.session);
    }
  })
}