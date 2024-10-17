/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-10 15:13:56
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 16:16:52
 * @Description:
 */
import type { AxiosRequestConfig } from 'axios'
import type { RequestInstanceState } from './type'
import { fetchRefreshToken } from '@/service/api'
import { useAuthStore } from '@/store/modules/auth'
import { localStg } from '@/utils/storage'

/**
 * 异步处理刷新令牌的函数
 * 该函数尝试使用刷新令牌获取新的访问令牌，并更新请求配置中的授权信息
 * 如果刷新令牌失败，它将重置认证状态并返回null
 *
 * @param axiosConfig Axios请求配置对象，用于发送网络请求
 * @returns 返回更新后的请求配置对象，或在刷新令牌失败时返回null
 */
export async function handleRefreshToken(axiosConfig: AxiosRequestConfig) {
  // 使用useAuthStore钩子获取重置存储的函数
  const { resetStore } = useAuthStore()
  // 从本地存储获取刷新令牌，如果不存在则默认为空字符串
  const refreshToken = localStg.get('refreshToken') || ''
  // 尝试使用刷新令牌获取新的访问令牌
  const { error, data } = await fetchRefreshToken(refreshToken)
  // 如果没有错误，表示刷新令牌成功
  if (!error) {
    // 将新的访问令牌和刷新令牌存储到本地存储
    localStg.set('token', data.token)
    localStg.set('refreshToken', data.refreshToken)
    // 复制axiosConfig以避免直接修改原始配置
    const config = { ...axiosConfig }
    // 如果配置中已有headers，则更新Authorization字段为新的访问令牌
    if (config.headers) {
      config.headers.Authorization = data.token
    }
    // 返回更新后的请求配置
    return config
  }
  // 如果刷新令牌失败，重置认证状态
  resetStore()
  // 返回null表示刷新令牌失败
  return null
}
/**
 * 显示错误消息
 *
 * 此函数用于向用户显示错误消息，并确保同一消息不重复显示
 * 它通过维护一个错误消息栈来管理当前显示的错误信息
 *
 * @param state 请求实例的状态对象，包含错误消息栈等信息
 * @param message 欲显示的错误消息
 */
export function showErrorMsg(state: RequestInstanceState, message: string) {
  // 初始化错误消息栈，如果它尚未被创建
  if (!state.errMsgStack?.length) {
    state.errMsgStack = []
  }
  // 检查消息是否已经存在于消息栈中
  const isExist = state.errMsgStack.includes(message)
  // 如果消息不存在于消息栈中，则添加它
  if (!isExist) {
    state.errMsgStack.push(message)
    // 以下代码被注释掉，可能是因为它涉及到的具体UI操作与当前环境不兼容
    // 或者因为有更好的方式来通知用户错误
    // 它原本的逻辑是：当消息离开视图时，从消息栈中移除该消息
    // 并在5秒后清空消息栈
    // window.$message?.error(message, {
    //   onLeave: () => {
    //     state.errMsgStack = state.errMsgStack.filter(msg => msg !== message)

    //     setTimeout(() => {
    //       state.errMsgStack = []
    //     }, 5000)
    //   },
    // })
  }
}
