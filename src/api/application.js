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

export function rejected(data) {
  return request({
    url: '/applications/rejected',
    method: 'post',
    data: data
  })
}
export function confirmed(id) {
  return request({
    url: '/applications/confirmed/' + id,
    method: 'put'
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
export function getProviderByPassport(query) {
  return request({
    url: '/applications/id-card',
    method: 'post',
    params: query
  })
}
export function regions(query) {
  return request({
    url: '/resources/regions',
    method: 'get',
    params: query
  })
}
export function districts(query) {
  return request({
    url: '/resources/districts',
    method: 'get',
    params: query
  })
}

export function socialStatuses(query) {
  return request({
    url: '/resources/socialStatuses',
    method: 'get',
    params: query
  })
}
export function denyReasons(query) {
  return request({
    url: '/resources/denyReasons',
    method: 'get',
    params: query
  })
}
