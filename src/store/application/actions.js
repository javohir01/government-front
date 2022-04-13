import {sendMessage, confirm, store, index, show, rejected, confirmed, getNumber, checkApplication } from '@/api/application'

export const actions = {
  index({ commit }, query) {
    return new Promise((resolve, reject) => {
      index(query).then(res => {
        // console.log(res)
        commit('SET_APPLICATIONS', res.result.applications)
        commit('SET_TOTAL_COUNT', res.result.applications.total)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  sendMessage({ commit }, params) {
    return new Promise((resolve, reject) => {
      sendMessage(params)
        .then(res => {
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  confirm({ commit }, data) {
    return new Promise((resolve, reject) => {
      confirm(data)
        .then(res => {
          commit('SET_PHONE_NUMBER', data.phone_number)
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  rejected({ commit }, id) {
    return new Promise((resolve, reject) => {
      rejected(id)
        .then(res => {
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  confirmed({ commit }, id) {
    return new Promise((resolve, reject) => {
      confirmed(id)
        .then(res => {
          commit('SET_PHONE_NUMBER', data.phone_number)
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  setForm({ commit }, { form, application }) {
    form.id = application.id
    form.l_name = application.l_name
    form.f_name = application.f_name
    form.m_name = application.m_name
    form.passport = application.passport
    form.birth_date = application.birth_date.split('-').reverse().join('.')
    form.address = application
    form.region_id = application.region_id
    form.district_id = application.district_id
    form.social_id = application.social_id
    form.source = 1
    form.pin = application.pin

    form.phone_number = application.phone_number
    form.social_status = application.social_status
  },
  store({ commit }, { data }) {
    data.passport = data.passport.replace(' ', '')
    data.birth_date = data.birth_date.split('.').reverse().join('-')
    return new Promise((resolve, reject) => {
      store(data)
        .then(res => {
          console.log(res.result.Application)
          commit('SET_CHECK_DETAILS', res.result.Application.Application)
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  show({ commit }, application_id) {
    return new Promise((resolve, reject) => {
      show(application_id).then(res => {
        commit('SET_APPLICATION', res.result.application)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getNumber({ commit }, { data }) {
    data.passport = data.passport.replace(' ', '')
    data.birth_date = data.birth_date.split('.').reverse().join('-')
    return new Promise((resolve, reject) => {
      getNumber(data)
        .then(res => {
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  checkApplication({ commit }, data) {
    return new Promise((resolve, reject) => {
      checkApplication(data)
        .then(res => {
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
}
