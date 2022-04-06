export const state = {
  citizen: {
    id: '',
    passport: '',
    l_name: '',
    f_name: '',
    m_name: '',
    birth_date: '',
    pin: '',
    region_id: '',
    district_id: '',
    region: {},
    district: {},
    social_status: {},
    address: ''
  },
  citizens: {
    data: [],
    pagination: {}
  },
  regions: [],
  districts: [],
  social_statuses: [],
  total: 0

}
