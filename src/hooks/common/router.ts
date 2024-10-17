import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import type { RouteKey } from '@elegant-router/types'
import { router as globalRouter } from '@/router'

/**
 * 生成路由导航相关的函数以简化导航操作
 *
 * @param inSetup 是否处于组件的setup函数中，默认为true
 * @returns 一组路由导航相关的函数，包括但不限于直接推送、带元数据查询的推送和登录相关导航
 */
export function useRouterPush(inSetup = true) {
  // 根据是否在setup中决定使用局部router还是全局router
  const router = inSetup ? useRouter() : globalRouter
  // 获取当前路由信息
  const route = globalRouter.currentRoute

  // 封装router的push方法，以便后续直接调用
  const routerPush = router.push

  // 封装router的back方法，以便返回上一级路由
  const routerBack = router.back

  // 定义路由推送的选项接口，包括查询参数和路由参数
  interface RouterPushOptions {
    query?: Record<string, string>
    params?: Record<string, string>
  }

  /**
   * 根据路由键进行路由推送
   *
   * @param key 路由的标识键
   * @param options 可选的查询参数和路由参数
   * @returns 返回路由推送的结果
   */
  async function routerPushByKey(key: RouteKey, options?: RouterPushOptions) {
    // 解构赋值获取查询参数和路由参数
    const { query, params } = options || {}

    // 初始化路由位置对象
    const routeLocation: RouteLocationRaw = {
      name: key,
    }

    // 如果有查询参数，则添加到路由位置对象中
    if (Object.keys(query || {}).length) {
      routeLocation.query = query
    }

    // 如果有路由参数，则添加到路由位置对象中
    if (Object.keys(params || {}).length) {
      routeLocation.params = params
    }

    // 执行路由推送
    return routerPush(routeLocation)
  }

  /**
   * 根据路由键进行路由推送，并附加元数据查询参数
   *
   * @param key 路由的标识键
   * @returns 返回路由推送的结果
   */
  function routerPushByKeyWithMetaQuery(key: RouteKey) {
    // 获取所有路由
    const allRoutes = router.getRoutes()
    // 查找对应路由的元数据
    const meta = allRoutes.find(item => item.name === key)?.meta || null

    // 初始化查询参数对象
    const query: Record<string, string> = {}

    // 如果存在元数据查询参数，则将其添加到查询参数对象中
    meta?.query?.forEach((item) => {
      query[item.key] = item.value
    })

    // 执行带有元数据查询参数的路由推送
    return routerPushByKey(key, { query })
  }

  /**
   * 导航到主页
   *
   * @returns 无返回值
   */
  async function toHome() {
    // 推送至主页路由
    return routerPushByKey('root')
  }

  /**
   * 导航到登录页面
   *
   * @param loginModule 可选的登录模块，默认为'pwd-login'
   * @param redirectUrl 重定向URL，默认为当前路由的fullPath
   * @returns 返回登录页面导航的结果
   */
  async function toLogin(loginModule?: UnionKey.LoginModule, redirectUrl?: string) {
    // 确定登录模块
    const module = loginModule || 'pwd-login'

    // 初始化路由推送选项
    const options: RouterPushOptions = {
      params: {
        module,
      },
    }

    // 确定重定向URL
    const redirect = redirectUrl || route.value.fullPath

    // 设置重定向URL到查询参数中
    options.query = {
      redirect,
    }

    // 执行登录页面的路由推送
    return routerPushByKey('login', options)
  }

  /**
   * 切换登录模块
   *
   * @param module 登录模块
   * @returns 返回切换登录模块后的导航结果
   */
  async function toggleLoginModule(module: UnionKey.LoginModule) {
    // 获取当前路由的查询参数
    const query = route.value.query as Record<string, string>

    // 执行带元数据查询和登录模块参数的路由推送
    return routerPushByKey('login', { query, params: { module } })
  }

  /**
   * 从登录页面重定向
   *
   * @param [needRedirect] 登录后是否需要重定向，默认为true
   * @returns 无返回值
   */
  async function redirectFromLogin(needRedirect = true) {
    // 获取重定向URL
    const redirect = route.value.query?.redirect as string

    // 根据是否需要重定向执行不同的操作
    if (needRedirect && redirect) {
      // 直接重定向到指定URL
      routerPush(redirect)
    }
    else {
      // 导航到主页
      toHome()
    }
  }

  // 返回一组路由导航相关的函数
  return {
    routerPush,
    routerBack,
    routerPushByKey,
    routerPushByKeyWithMetaQuery,
    toLogin,
    toggleLoginModule,
    redirectFromLogin,
  }
}
