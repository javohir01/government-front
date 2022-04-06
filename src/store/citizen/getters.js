export const getters = {
  GET_CITIZEN: (state) => state.citizen,
  GET_CITIZENS: (state) => state.citizens.data,
  GET_CITIZENS_PAGINATION: (state) => state.citizens.pagination,
  FULL_NAME: (state) => state.citizen.l_name + ' ' + state.citizen.f_name + ' ' + state.citizen.m_name,
  GET_REGIONS: (state) => state.regions,
  GET_SOCIAL_STATUSES: (state) => state.social_statuses,
  GET_DISTRICTS: (state) => state.districts
}
