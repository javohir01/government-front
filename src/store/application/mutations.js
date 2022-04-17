export const mutations = {
  SET_APPLICATION: (state, application) => {
    state.application.id = application.id
    state.application.passport = application.passport
    state.application.l_name = application.l_name
    state.application.f_name = application.f_name
    state.application.m_name = application.m_name
    state.application.birth_date = application.birth_date
    state.application.pin = application.pin
    state.application.region_id = application.region_id
    state.application.district_id = application.district_id
    state.application.social_id = application.social_id
    state.application.region = application.region
    state.application.district = application.district
    state.application.phone_number = application.phone_number
    state.application.number = application.number
    state.application.code = application.code
    state.application.status = application.status
    state.application.address = application.address
    state.application.social_status = application.social_status
  },
  SET_CHECK_DETAILS: (state, Application) => {
    state.check_details.number = Application.number
    state.check_details.code = Application.code
  },
  SET_APPLICATIONS: (state, applications) => {
    state.applications.data = applications.data
    state.applications.pagination = {
      total: applications.total !== -1 ? applications.total : getTotal(applications),
      page: applications.current_page,
      limit: applications.per_page
    }
  },
  SET_PHONE_NUMBER: (state, phone_number) => {
    state.phone_number = phone_number
  },
  SET_REGIONS: (state, regions) => {
    state.regions = regions
  },
  SET_DISTRICTS: (state, districts) => {
    state.districts = districts
  },
  SET_SOCIAL_STATUSES: (state, social_statuses) => {
    state.social_statuses = social_statuses
  },
  SET_DENY_REASONS: (state, deny_reasons) => {
    state.deny_reasons = deny_reasons
  },
  SET_TOTAL_COUNT: (state, count) => {
    state.total = count
    state.applications.pagination.total = (count !== -1 ? count : state.applications.pagination.total)
  }
}

function getTotal(applications) {
  return applications.current_page * applications.per_page + 1
}
