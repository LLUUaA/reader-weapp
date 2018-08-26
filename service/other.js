import request from './request';

export function getConfig(data) {
  return request({
    api: `book/getConfig`,
    data
  },false);
}
