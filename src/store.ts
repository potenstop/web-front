import Vue from 'vue'
import Vuex from 'vuex'
import * as Cookies from 'js-cookie'
import { SysUtil } from '@/common/util/SysUtil'
import { MemberApi } from '@/dao/api/MemberApi'
import { MemberRegisterRequest } from '@/request/MemberRegisterRequest'
Vue.use(Vuex)
class Member {
  memberId: number
  nickname: string
}
export default new Vuex.Store({
  state: {
    loginState: {
      loginIn: false,
      member: {
        nickname: '',
        memberId: 0
      }
    },
    uuid: ''
  },
  mutations: {
    loginIn (state, member: Member) {
      // 登入状态
      state.loginState.loginIn = true
      state.loginState.member = member
      console.log('==================')
      Cookies.set('loginState', state.loginState, { expires: 1 })
      Cookies.set('uuid', state.uuid)
    },
    loginOut (state) {
      // 登出状态
      state.loginState.loginIn = false
      state.loginState.member = new Member()
      Cookies.remove('loginState')
    },
    syncLoginState (state) {
      const cookieState = Cookies.getJSON('loginState')
      const uuid = Cookies.getJSON('uuid')
      if (uuid) {
        state.uuid = uuid
      } else {
        // 产生唯一的uuid
        state.uuid = SysUtil.generateUUID()
      }
      if (cookieState) {
        state.loginState = cookieState
      }
    }
  },
  actions: {
    async authUser ({ state, commit }) {
      // 从服务器端校验本地登录 Cookie 有效性
      const memberApi = new MemberApi()
      try {
        let result = await memberApi.visitorLogin(state.uuid)
        if (result.getCode() === '0') {
          commit('loginIn', result.getData())
        }
      } catch (e) {
        // 请求失败
        console.error('请求失败了')
      }
    }
  },
  getters: {
    nickname: (state, getters, rootState) => {
      if (state.loginState.loginIn) {
        return state.loginState.member.nickname
      }
    },
    offLine: (state, getters, rootState) => {
      return !state.loginState.loginIn
    }
  }
})
