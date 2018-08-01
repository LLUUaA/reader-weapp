
var env, devEnv = true;
/**
 * 开发环境
 */
const dev = {
  host: "http://192.168.1.178.:3000/"
  // host: "http://192.168.66.100:3000/"
}

/**
 * 线上环境
 */
const pro = {
  host: "https://api.bubaocloud.xin/"
}

env = devEnv ? dev : pro;

module.exports = env