export const mutations = {
  SET_ID: (state, id) => (state.user.id = id),
  // SET_LOGIN: (state, login) => (state.user.login = login),
  SET_USER: (state, user) => {
    state.user.id = user.id
    state.user.login = user.login
    state.user.email = user.email
    state.user.password = user.password
    state.user.role_id = user.role_id
  },
  SET_USER_TOKEN: (state, token) => (state.user.token = token),
  SET_IS_AUTH: (state, condition) => (state.user.is_auth = condition)
}
