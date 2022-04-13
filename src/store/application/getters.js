export const getters = {
  GET_APPLICATION: (state) => state.application,
  GET_APPLICATIONS: (state) => state.applications.data,
  GET_APPLICATIONS_PAGINATION: (state) => state.application.pagination,
  FULL_NAME: (state) => state.application.l_name + ' ' + state.application.f_name + ' ' + state.application.m_name,
  GET_REGIONS: (state) => state.regions,
  GET_SOCIAL_STATUSES: (state) => state.social_statuses,
  GET_DISTRICTS: (state) => state.districts,
  GET_PHONE_NUMBER: (state) => state.phone_number,
  GET_CHECK_DETAILS: (state) => state.check_details
}
