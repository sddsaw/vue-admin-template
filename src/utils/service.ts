/**
 * 创建服务配置
 * 此函数根据环境变量构建服务的基础URL和其他服务的基础URL的配置
 *
 * @param env 包含环境变量的对象，用于获取服务的基础URL
 * @returns 返回一个包含服务配置的对象
 */
export function createServiceConfig(env: Env.ImportMeta) {
  // 从环境变量中提取服务基础URL和其他服务基础URL
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env
  // 初始化一个空对象，用于存储解析后的其他服务的基础URL
  let other = {} as Record<App.Service.OtherBaseURLKey, string>
  try {
    // 尝试解析环境变量中的JSON字符串为对象
    other = JSON.parse(VITE_OTHER_SERVICE_BASE_URL)
  }
  catch {
    // 如果解析失败，则输出错误信息
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid JSON string')
  }
  // 创建基础HTTP配置，包括主服务和其它服务的基础URL
  const httpConfig: App.Service.SimpleServiceConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other,
  }
  // 提取其他HTTP配置中的键作为数组
  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[]
  // 为每个其他服务创建详细的配置项
  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map((key) => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key),
    }
  })
  // 组合主服务和其它服务的配置
  const config: App.Service.ServiceConfig = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig,
  }
  // 返回最终的配置对象
  return config
}

/**
 * 根据环境变量和是否使用代理的标志获取服务基础URL
 *
 * 此函数用于构建服务请求的基础URL，依据是否启用代理来决定使用何种URL模式
 * 对于非标准环境变量或需要动态配置代理的情况特别有用
 *
 * @param env 环境变量对象，包含部署环境信息
 * @param isProxy 布尔值，指示是否启用代理如果启用，会影响基础URL的构建方式
 * @returns 返回一个对象，包含标准服务基础URL和其它服务的基础URL
 */
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
  // 创建服务配置，包括基础URL和其他必要配置
  const { baseURL, other } = createServiceConfig(env)
  // 初始化其他服务的基础URL对象
  const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>
  // 遍历其他配置项，根据是否启用代理来决定使用代理模式还是直连模式
  other.forEach((item) => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL
  })
  // 返回构建的服务基础URL对象，根据是否启用代理来决定使用何种模式的基础URL
  return {
    baseURL: isProxy ? createProxyPattern() : baseURL,
    otherBaseURL,
  }
}

/**
 * 根据给定的键生成后端服务基础URL的代理模式
 *
 * 此函数用于构建一个代理模式字符串，用于后续的请求代理配置
 * 如果没有提供特定的键，将使用默认的代理模式
 *
 * @param key 可选参数，用于指定特定的代理模式如果未提供此参数，将使用默认的代理模式
 * @returns 返回构建的代理模式字符串
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  // 当没有提供键时，返回默认的代理模式路径
  if (!key) {
    return '/proxy-default'
  }
  // 根据提供的键生成并返回特定的代理模式路径
  return `/proxy-${key}`
}
