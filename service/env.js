var env, devEnv = false;

env = {
  ver: "v1.0.4.3",
  ENV: devEnv
}

/**
 * 开发环境
 */
const dev = {
  // host: "http://192.168.66.100:3000/"
  host: "http://192.168.1.178:3000/"
}

/**
 * 线上环境
 */
const pro = {
  host: "https://api.bubaocloud.xin/"
}

env = Object.assign(env, devEnv ? dev : pro);

module.exports = env