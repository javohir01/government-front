import request from '@/utils/request'

export function index(query) {
  return request({
    url: '/citizens',
    method: 'get',
    params: query
  })
}

export function show(id) {
  return request({
    url: '/citizens/' + id,
    method: 'get'
  })
}

export function store(data) {
  return request({
    url: 'citizens/store',
    method: 'post',
    data
  })
}

export function edit(id) {
  return request({
    url: '/citizens/' + id,
    method: 'get'
  })
}

export function update(data) {
  return request({
    url: '/citizens/' + data.id,
    method: 'put',
    data: data
  })
}

export function destroyCitizen(id) {
  return request({
    url: 'citizens/' + id,
    method: 'delete'
  })
}

export function bulk(type, list) {
  const dataJSON = JSON.parse(JSON.stringify(list))
  return request({
    url: '/roles/bulk?type=' + type,
    method: 'post',
    data: dataJSON
  })
}

export function passport(data) {
  return request({
    url: 'citizens/passport',
    method: 'post',
    data: data
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
