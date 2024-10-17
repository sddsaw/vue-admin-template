/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-10 15:15:11
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 16:39:56
 * @Description:
 */
import { createLocalforage, createStorage } from '@space/utils'
// 定义存储前缀，默认为空字符串
const storagePrefix = import.meta.env.VITE_STORAGE_PREFIX || ''
// 创建本地存储实例，使用指定的类型和前缀
export const localStg = createStorage<StorageType.Local>('local', storagePrefix)
// 创建会话存储实例，使用指定的类型和前缀
export const sessionStg = createStorage<StorageType.Session>('session', storagePrefix)
// 创建本地持久化存储实例，使用指定的类型
export const localforage = createLocalforage<StorageType.Local>('local')
