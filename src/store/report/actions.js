import { reportAll, reportDistricts } from '@/api/report'
export const actions = {
  reportAll({ commit }, query) {
    return new Promise((resolve, reject) => {
      reportAll(query).then(res => {
        commit('SET_REPORT', res.result.report)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  },
  reportDistricts({ commit }, data) {
    return new Promise((resolve, reject) => {
      reportDistricts(data)
        .then(res => {
          commit('SET_DISTRICTS_REPORT', res.result.report)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
}


