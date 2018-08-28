import request from './request';

export function getConfig(data) {
  console.warn(data);
  return request({
    api: `book/getConfig`,
    data
  },false);
}
