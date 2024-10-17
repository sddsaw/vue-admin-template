import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'
import { useLoading } from '@space/hooks'
import { clearAuthStorage, getToken } from './shared'
import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { fetchGetUserInfo, fetchLogin } from '@/service/api'
import { localStg } from '@/utils/storage'
// import { useRouteStore } from '../route';
// import { useTabStore } from '../tab';

/**
 * @description:
 * @param {*} defineStore
 * @return {*}
 */

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute()
  // const routeStore = useRouteStore();
  // const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false)
  const { loading: loginLoading, startLoading, endLoading } = useLoading()

  const token = ref(getToken())
  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    userName: '',
    roles: [],
    buttons: [],
  })
  /**
   * 计算是否为静态超级用户
   *
   * 该计算属性判断是否启用了静态路由模式，并且用户角色中包含指定的超级用户角色。
   */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env

    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE)
  })

  /** 是否登录 */
  const isLogin = computed(() => Boolean(token.value))

  /**
   * 重置存储
   *
   * 该函数用于清除认证存储并重置认证状态。如果当前路由不是常量路由，则导航至登录页面。
   */
  async function resetStore() {
    const authStore = useAuthStore()

    clearAuthStorage()

    authStore.$reset()

    if (!route.meta.constant) {
      await toLogin()
    }
    // 以下代码块注释掉了标签页缓存和路由状态重置的功能
    // tabStore.cacheTabs()
    // routeStore.resetStore()
  }

  /**
   * 登录功能
   *
   * 该函数尝试使用用户名和密码登录用户。如果登录成功且重定向参数为 true，则登录后会进行重定向。如果登录过程中发生错误，则重置存储。
   *
   * @param userName 用户名
   * @param password 密码
   * @param [redirect] 登录后是否重定向，默认为 `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading()

    const { data: loginToken, error } = await fetchLogin(userName, password)

    if (!error) {
      // 验证登录令牌是否有效
      const pass = await loginByToken(loginToken)

      if (pass) {
        // 初始化授权路由，这段代码目前被注释
        // await routeStore.initAuthRoute()
        // 执行登录后的重定向
        await redirectFromLogin(redirect)
        // 以下代码块注释掉了对成功登录的通知
        // if (routeStore.isInitAuthRoute) {
        //   window.$notification?.success({
        //     title: $t('page.login.common.loginSuccess'),
        //     content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
        //     duration: 4500,
        //   })
        // }
      }
    }
    else {
      // 如果登录过程中发生错误，重置存储
      resetStore()
    }

    endLoading()
  }
  /**
   * 使用登录令牌进行用户登录
   * @param loginToken 包含访问令牌和刷新令牌的登录令牌对象
   * @returns 返回一个布尔值，表示登录是否成功
   */

  async function loginByToken(loginToken: Api.Auth.LoginToken) {
    // 1. 将令牌存储于本地存储中，后续请求的头部需要使用到它
    localStg.set('token', loginToken.token)
    // 将刷新令牌存储于本地存储中，用于令牌过期时刷新获取新令牌
    localStg.set('refreshToken', loginToken.refreshToken)

    // 2. 获取用户信息，用于验证用户身份
    const pass = await getUserInfo()
    // 如果获取用户信息成功，认为登录成功
    if (pass) {
      // 更新应用内使用的令牌
      token.value = loginToken.token
      // 如果获取用户信息失败，登录失败
      return true
    }

    return false
  }
  /**
   * 异步获取用户信息
   *
   * 本函数通过调用fetchGetUserInfo方法获取用户信息该方法返回一个包含用户信息和错误信息的对象
   * 如果没有错误，将更新userInfo对象的值并返回true，否则返回false
   *
   * @returns {Promise<boolean>} 如果用户信息获取成功，则返回true；否则返回false
   */
  async function getUserInfo() {
    // 调用fetchGetUserInfo方法获取用户信息和错误信息
    const { data: info, error } = await fetchGetUserInfo()

    if (!error) {
      // 如果没有错误，更新userInfo对象的值
      Object.assign(userInfo, info)

      return true
    }

    return false
  }
  /**
   * 异步初始化用户信息
   *
   * 该函数主要用于在应用初始化时设置用户的个人信息它首先检查用户是否已经登录（即是否存在令牌），
   * 如果存在，则尝试获取用户的详细信息如果用户信息获取失败，则重置应用的状态
   */
  async function initUserInfo() {
    // 检查是否存在用户登录令牌
    const hasToken = getToken()
    // 如果存在令牌，进一步获取用户信息
    if (hasToken) {
      // 尝试获取用户详细信息
      const pass = await getUserInfo()
      // 如果用户信息获取失败，则重置应用状态
      if (!pass) {
        resetStore()
      }
    }
  }

  return {
    token,
    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    initUserInfo,
  }
})
