import { getToken } from '@/utils/auth'

export const state = {
  user: {
    is_auth: false,
    id: '',
    login: '',
    email: '',
    password: '',
    role_id: 0,
    token: getToken(),
    permissions: []
  }
}
