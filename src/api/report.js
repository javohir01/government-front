import request from '@/utils/request'
export function reportAll() {
  return request({
    url: 'report/all',
    method: 'get'
  })
}
