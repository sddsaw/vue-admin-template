/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-19 13:31:25
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 14:59:42
 * @Description:
 */
import type { App } from 'vue'
import {
  type RouterHistory,
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { createBuiltinVueRoutes } from './routes/builtin'
// import { createRouterGuard } from './guard'

const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env

const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  hash: createWebHashHistory,
  history: createWebHistory,
  memory: createMemoryHistory,
}

export const router = createRouter({
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),
  routes: createBuiltinVueRoutes(),
})

/**
 * 设置路由
 *
 * 本函数负责初始化和准备路由在应用中的使用它包括以下步骤：
 * 1. 应用中间件：将传入的router中间件应用到应用实例上
 * 2. 创建路由守卫：调用createRouterGuard函数，为router创建路由守卫，以实现路由的权限控制
 * 3. 确保路由准备就绪：通过异步等待router.isReady()方法的结果，确保所有异步的路由配置已经加载完成
 *
 * @param {App} app 应用实例，用于应用路由和初始化操作
 */

export async function setupRouter(app: App) {
  app.use(router)
  // createRouterGuard(router)
  await router.isReady()
}
