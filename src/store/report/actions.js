import { reportAll, reportDistricts, reportApplicationDistricts, reportApplicationRegions } from '@/api/report'
export const actions = {
  reportAll({ commit }, query) {
    return new Promise((resolve, reject) => {
      reportAll(query).then(res => {
        commit('SET_REGIONS_REPORT', res.result.report)
        commit('SET_REGIONS_REPORT_COUNT', res.result.report_count)
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
          console.log(res.result.report_count)
          commit('SET_DISTRICTS_REPORT_COUNT', res.result.report_count)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  reportApplicationRegions({ commit }, query) {
    return new Promise((resolve, reject) => {
      reportApplicationRegions(query)
        .then(res => {
          commit('SET_APPLICATION_REGIONS_REPORT', res.result.report)
          commit('SET_APPLICATION_REGIONS_REPORT_COUNT', res.result.report_count)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  reportApplicationDistricts({ commit }, data) {
    return new Promise((resolve, reject) => {
      reportApplicationDistricts(data)
        .then(res => {
          commit('SET_APPLICATION_DISTRICTS_REPORT', res.result.report)
          commit('SET_APPLICATION_DISTRICTS_REPORT_COUNT', res.result.report_count)
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

}

