import request from '@/utils/request'
export function reportAll(query) {
  return request({
    url: 'report/report',
    method: 'get',
    params: query
  })
}

export function reportDistricts(data) {
  return request({
    url: 'report/districts/' + data.region_id,
    method: 'get',
    params: data
  })
}
