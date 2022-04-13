import request from '@/utils/request'

export function sendMessage(data) {
  // console.log(data)
  return request({
    url: '/applications/send-sms',
    method: 'post',
    data
  })
}
export function confirm(data) {
  // console.log(data)
  return request({
    url: '/applications/confirm-sms',
    method: 'post',
    data
  })
}
export function store(data) {
  return request({
    url: '/applications/store',
    method: 'post',
    data
  })
}
export function index(query) {
  return request({
    url: '/applications',
    method: 'get',
    params: query
  })
}

export function show(id) {
  return request({
    url: '/applications/' + id,
    method: 'get'
  })
}

export function rejected(id) {
  return request({
    url: '/applications/rejected/' + id,
    method: 'put'
    // data: data
  })
}
export function confirmed(id) {
  return request({
    url: '/applications/confirmed/' + id,
    method: 'put'
    // data: data
  })
}
export function updatePhone(data) {
  return request({
    url: 'users/update-phone',
    method: 'put',
    data
  })
}

export function checkApplication(data) {
  return request({
    url: '/applications/check',
    method: 'post',
    data
  })
}
