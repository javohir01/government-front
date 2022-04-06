import {
  show,
  edit,
  update,
  index,
  store,
  passport,
  regions,
  destroyCitizen,
  districts,
  socialStatuses
} from '@/api/citizen'
export const actions = {
  loadCitizen({ commit }, res) {
    commit('SET_CITIZEN', res.result.citizen)
  },
  index({ commit }, query) {
    return new Promise((resolve, reject) => {
      index(query).then(res => {
        console.log(res)
        commit('SET_CITIZENS', res.result.citizens)
        commit('SET_TOTAL_COUNT', res.result.citizens.total)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getTotal({ commit }, query) {
    return new Promise((resolve, reject) => {
      index(query).then(res => {
        commit('SET_TOTAL_COUNT', res.result.citizens)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // eslint-disable-next-line no-empty-pattern
  indexFull({}, query) {
    return new Promise((resolve, reject) => {
      index(query).then(res => {
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  show({ commit }, citizen_id) {
    return new Promise((resolve, reject) => {
      show(citizen_id).then(res => {
        commit('SET_CITIZEN', res.result.citizen)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  edit({ commit }, id) {
    return new Promise((resolve, reject) => {
      edit(id)
        .then(res => {
          resolve(res)
        })
    })
  },
  store({ commit }, { data }) {
    data.passport = data.passport.replace(' ', '')
    data.birth_date = data.birth_date.split('.').reverse().join('-')
    return new Promise((resolve, reject) => {
      store(data)
        .then(res => {
          resolve(res)
        }).catch((res) => { reject(res) })
    })
  },
  update({ commit }, data) {
    data.passport = data.passport.replace(' ', '')
    data.birth_date = data.birth_date.split('.').reverse().join('-')
    return new Promise((resolve, reject) => {
      update(data)
        .then(res => {
          resolve(res)
        }).catch(res => {
          reject(res)
        })
    })
  },
  delete({ commit }, id) {
    return new Promise((resolve, reject) => {
      destroyCitizen(id)
        .then(res => {
          resolve(res)
        }).catch((res) => {
          reject(res)
        })
    })
  },
  passport({ commit }, params) {
    const data = { passport: params.passport.replace(' ', ''), birth_date: params.birth_date }
    return new Promise((resolve, reject) => {
      passport(data)
        .then(res => {
          if (res.success === false) {
            reject(res)
          } else {
            resolve(res)
          }
        })
        .catch(err => {
          reject(err)
        })
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
        commit('SET_SOCIAL_STATUSES', res.result.social_statuses)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  setForm({ commit }, { form, citizen }) {
    if (citizen.id) {
      form.id = citizen.id
      form.birth_date = citizen.birth_date.split('-').reverse().join('.')
      form.l_name = citizen.l_name
      form.passport = citizen.passport
      form.f_name = citizen.f_name
      form.m_name = citizen.m_name
      form.address = citizen.address
      form.source = 1
      form.pin = citizen.pin
      form.social_id = citizen.social_id
      form.social_status = citizen.social_status
    } else {
      form.birth_date = citizen.date_birth
      form.l_name = citizen.l_name
      form.f_name = citizen.f_name
      form.m_name = citizen.m_name
      form.social_id = citizen.social_id
    }
  },
  setMvdForm({ commit }, { form, citizen }) {
    if (citizen.id) {
      form.id = citizen.id
      form.birth_date = citizen.birth_date.split('-').reverse().join('.')
      form.l_name = citizen.l_name
      form.passport = citizen.passport
      form.f_name = citizen.f_name
      form.m_name = citizen.m_name
      form.source = (citizen.source) ? citizen.source : 2
      form.social_id = citizen.social_id
    } else {
      form.social_id = citizen.social_id
      form.s_name = citizen.pSurname
      form.f_name = citizen.pName
      form.m_name = citizen.pPatronym
      form.gender = 1 * citizen.pSex
      form.pin = citizen.pPinpp
      form.new_passport = citizen.pPsp
      form.source = 2
    }
    try {
      const entrance_year = citizen.entrance_year
      if (entrance_year) {
        form.party_details.entrance_year = citizen.entrance_year
        form.party_details.ticket_number = citizen.ticket_number
      }
    } catch (exp) {
      form.party_details.entrance_year = ''
      form.party_details.ticket_number = ''
    }
  }
}
