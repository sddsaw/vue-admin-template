/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-10 16:05:52
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-16 12:10:03
 * @Description:
 */
import type { App } from 'vue'
import { createPinia } from 'pinia'
import { resetSetupStore } from './plugins'

/**
 * 设置和初始化Pinia状态管理 store
 *
 * 本函数负责创建并配置Pinia store，然后将其集成到Vue应用中
 * 它首先创建一个Pinia实例，然后使用resetSetupStore插件对其进行增强，
 * 最后将该store实例挂载到Vue应用中
 *
 * @param app Vue应用实例 该参数表示需要集成Pinia store的Vue应用
 *            通过这个参数，函数能够访问和修改Vue应用的状态管理
 */
export function setupStore(app: App) {
  // 创建Pinia实例，用于管理应用的状态
  const store = createPinia()

  // 使用resetSetupStore插件增强store，该插件可能提供了如状态重置之类的功能
  store.use(resetSetupStore)

  // 将store实例集成到Vue应用中，使整个应用能够管理并访问状态
  app.use(store)
}
