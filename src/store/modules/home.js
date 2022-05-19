import mockRequest from '@/utils/mockRequest'

const state = {
  list: {}
}

const actions = {
  // 发请求获取首页的mock数据
  async getData({ commit }) {
    const res = await mockRequest.get('/home/list')
    if (res.code === 20000) {
      commit('GETDATA', res.data)
    }
  }
}

const mutations = {
  GETDATA(state, list) {
    state.list = list
  }
}

const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}
