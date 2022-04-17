import { sendMessage, confirm, store, index, districts, regions, socialStatuses, show, rejected, confirmed, getProviderByPassport, checkApplication, denyReasons } from '@/api/application'

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
  rejected({ commit }, data) {
    return new Promise((resolve, reject) => {
      rejected(data)
        .then(res => {
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  confirmed({ commit }, id) {
    return new Promise((resolve, reject) => {
      confirmed(id)
        .then(res => {
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  getCitizenByPassport({ commit }, query) {
    if (query.passport.includes(' ')) {
      query.passport = query.passport.replace(' ', '')
    }
    return new Promise((resolve, reject) => {
      getProviderByPassport(query).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
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
    // console.log('data')
    // console.log(data)
    data.passport = data.passport.replace(' ', '')
    data.birth_date = data.birth_date.split('.').reverse().join('-')
    return new Promise((resolve, reject) => {
      store(data)
        .then(res => {
          // console.log(res.result.Application)
          commit('SET_CHECK_DETAILS', res.result.Application.Application)
          // console.log(res.result.Application.Application.code)
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
  regions({ commit }, data) {
    return new Promise((resolve, reject) => {
      regions(data).then(res => {
        commit('SET_REGIONS', res.result.regions)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  districts({ commit }, data) {
    return new Promise((resolve, reject) => {
      districts(data).then(res => {
        commit('SET_DISTRICTS', res.result.districts)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  socialStatuses({ commit }, data) {
    return new Promise((resolve, reject) => {
      socialStatuses(data).then(res => {
        console.log(data)
        commit('SET_SOCIAL_STATUSES', res.result.social_statuses)
        console.log(res.result.social_statuses)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  denyReasons({ commit }, data) {
    return new Promise((resolve, reject) => {
      denyReasons(data).then(res => {
        console.log(data)
        commit('SET_DENY_REASONS', res.result.deny_reasons)
        console.log(res.result.social_statuses)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}
