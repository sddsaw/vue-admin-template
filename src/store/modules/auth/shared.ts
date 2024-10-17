import { localStg } from '@/utils/storage'

/**
 * 获取存储在本地的token
 *
 * 该函数尝试从本地存储（localStg）中获取'token'值如果'token'不存在，则返回一个空字符串
 * 这个函数被导出，以便其他模块可以访问它
 */
export function getToken() {
  return localStg.get('token') || ''
}

/**
 * 清除认证存储
 *
 * 此函数用于清除本地存储中的认证令牌和刷新令牌该功能通常在用户登出或清除会话时使用
 * 它通过移除存储在本地存储中的'token'和'refreshToken'项来实现，这两个项分别是当前的访问令牌和用于获取新访问令牌的刷新令牌
 */
export function clearAuthStorage() {
  localStg.remove('token')
  localStg.remove('refreshToken')
}
