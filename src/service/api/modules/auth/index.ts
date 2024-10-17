/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-19 14:37:10
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-20 11:47:38
 * @Description:
 */
import { request } from '@/service/request'

/**
 * @description: 使用提供的用户名和密码获取登录令牌。
 * @param {string} userName 用于身份验证的用户名。
 * @param {string} password 用于身份验证的密码。
 * @return {*}
 */
export function fetchLogin(userName: string, password: string) {
  return request<ApiAuth.LoginToken>({
    url: 'user/login',
    method: 'post',
    data: {
      userName,
      password,
    },
  })
}

/**
 * @description: 获取用户信息
 * @return {*}
 */
export function fetchGetUserInfo() {
  return request<ApiAuth.UserInfo>({ url: '/auth/getUserInfo' })
}

/**
 * @description: 请求刷新令牌
 * @param {string} refreshToken 刷新令牌字符串，用于请求新的登录令牌
 * @return 返回一个Promise，包含ApiAuth.LoginToken类型的数据，表示新的登录令牌信息
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<ApiAuth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken,
    },
  })
}

/**
 * @description: 获取并返回自定义后端错误。
 * @param code 错误代码，唯一标识错误类型的字符串。
 * @param msg 错误消息，描述错误详情的字符串。
 * @return 返回一个 Promise，解析为请求的结果。具体结果取决于后端实现。
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } })
}
