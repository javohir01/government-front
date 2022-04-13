export const state = {
  application: {
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
    social_id: '',
    social_status: {},
    status: '',
    number: '',
    phone_number: '',
    code: '',
    address: ''
  },
  applications: {
    data: [],
    pagination: {}
  },
  check_details: {
    number: '',
    code: ''
  },
  phone_number: 0,
  regions: [],
  districts: [],
  social_statuses: [],
  total: 0
}
