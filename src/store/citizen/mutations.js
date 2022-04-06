export const mutations = {
  SET_CITIZEN: (state, citizen) => {
    state.citizen.id = citizen.id
    state.citizen.passport = citizen.passport
    state.citizen.l_name = citizen.l_name
    state.citizen.f_name = citizen.f_name
    state.citizen.m_name = citizen.m_name
    state.citizen.birth_date = citizen.birth_date
    state.citizen.pin = citizen.pin
    state.citizen.region_id = citizen.region_id
    state.citizen.district_id = citizen.district_id
    state.citizen.region = citizen.region
    state.citizen.district = citizen.district
    state.citizen.address = citizen.address
    state.citizen.social_status = citizen.social_status
  },
  SET_CITIZENS: (state, citizens) => {
    state.citizens.data = citizens.data
    state.citizens.pagination = {
      total: citizens.total !== -1 ? citizens.total : getTotal(citizens),
      page: citizens.current_page,
      limit: citizens.per_page
    }
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
  SET_TOTAL_COUNT: (state, count) => {
    state.total = count
    state.citizens.pagination.total = (count !== -1 ? count : state.citizens.pagination.total)
  }
}

function getTotal(citizens) {
  console.log(citizens)
  return citizens.current_page * citizens.per_page + 1
}
