import request from './request';

export function getConfig() {
  return request({
    api: `book/getConfig`
  });
}