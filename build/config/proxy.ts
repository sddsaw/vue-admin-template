import type { ProxyOptions } from 'vite'
import { createServiceConfig } from '../../src/utils/service'
/**
 * 创建 Vite 代理配置
 *
 * 此函数根据环境变量和启用标志来生成 Vite 的代理配置它主要用于在开发环境中代理 API 请求，
 * 以避免跨域问题代理配置只有在 enable 参数为真且环境变量 VITE_HTTP_PROXY 设置为 'Y' 时才会生成
 *
 * @param env - 包含环境变量的 ImportMeta 对象，用于读取环境变量 VITE_HTTP_PROXY
 * @param enable - 是否启用代理的标志
 * @returns 如果代理被禁用，则返回 undefined；否则返回一个包含代理配置的对象
 */
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  // 判断是否启用 HTTP 代理
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y'
  // 如果不启用 HTTP 代理，则不生成代理配置
  if (!isEnableHttpProxy)
    return undefined
  // 根据环境变量创建服务配置，包括基础 URL、代理模式和其他配置
  const { baseURL, proxyPattern, other } = createServiceConfig(env)
  // 创建代理配置项，返回一个包含基础 URL 和代理模式的代理配置对象
  const proxy: Record<string, ProxyOptions> = createProxyItem({ baseURL, proxyPattern })
  // 遍历其他配置项，并将其合并到代理配置对象中
  other.forEach((item) => {
    Object.assign(proxy, createProxyItem(item))
  })
  // 返回最终的代理配置对象
  return proxy
}

/**
 * 根据服务配置项创建代理项
 *
 * 此函数的作用是针对给定的服务配置项生成一个代理配置对象这个代理配置对象主要用于在开发环境中
 * 代理服务器请求，以便于处理跨域问题和简化开发流程
 *
 * @param item 服务配置项对象，包含了代理所需的各项配置，如代理模式、目标URL等
 * @returns 返回一个代理配置对象，其中包含了根据服务配置项生成的代理规则
 */
function createProxyItem(item: App.Service.ServiceConfigItem) {
  // 初始化一个空的代理对象，该对象将存储所有代理规则
  const proxy: Record<string, ProxyOptions> = {}
  // 为指定的代理模式创建代理规则
  // 这里使用了ES6的语法，直接将键值对添加到proxy对象中
  proxy[item.proxyPattern] = {
    target: item.baseURL,
    changeOrigin: true,
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), ''),
  }
  // 返回包含了代理规则的proxy对象
  return proxy
}
