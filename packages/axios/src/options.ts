/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-04 15:02:51
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-04 15:34:41
 * @Description:
 */
import type { CreateAxiosDefaults } from 'axios'
import type { IAxiosRetryConfig } from 'axios-retry'
import { stringify } from 'qs'
import { isHttpSuccess } from './shared'
import type { RequestOption } from './type'

/**
 * 创建默认请求选项
 *
 * 该函数用于生成请求的默认配置选项它可以被请求函数使用，以确保有一些通用的默认行为
 * 比如如何处理成功的响应、失败的响应以及错误处理等这些默认选项可以在创建时被部分或全部覆盖
 *
 * @param options 可选参数，用于部分覆盖默认的请求选项
 * @returns 返回合并了传入选项和默认选项后的完整选项对象
 */
export function createDefaultOptions<ResponseData = any>(options?: Partial<RequestOption<ResponseData>>) {
  const opts: RequestOption<ResponseData> = {
    onRequest: async config => config,
    isBackendSuccess: _response => true,
    onBackendFail: async () => {},
    transformBackendResponse: async response => response.data,
    onError: async () => {},
  }

  Object.assign(opts, options)

  return opts
}

/**
 * 创建重试请求的配置选项
 *
 * 此函数旨在根据提供的配置参数生成重试策略的配置对象如果未提供配置，
 * 则默认配置为重试0次此函数允许通过参数覆盖默认的重试配置
 *
 * @param config 可选参数，部分Axios默认配置，用于覆盖或扩展重试配置
 * @returns 返回配置好的重试选项对象，包含调整后的重试次数
 */
export function createRetryOptions(config?: Partial<CreateAxiosDefaults>) {
  // 初始化重试配置，设置默认重试次数为0
  const retryConfig: IAxiosRetryConfig = {
    retries: 0,
  }
  // 将提供的配置与默认重试配置合并，以覆盖默认值
  Object.assign(retryConfig, config)
  // 返回合并后的重试配置
  return retryConfig
}
/**
 * 创建Axios配置的函数
 *
 * 此函数用于生成Axios请求的默认配置对象它提供了一些预定义的配置参数，
 * 比如超时时间和默认请求头，并允许在默认配置基础上覆盖或新增配置
 *
 * @param config - 可选参数，用于覆盖或新增Axios默认配置的属性
 * @returns 返回一个Axios配置对象，包含合并后的配置
 */
export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  // 定义10秒的超时时间，单位为毫秒
  const TEN_SECONDS = 10 * 1000
  // 初始化Axios配置对象，基于创建Axios时的默认配置类型
  const axiosConfig: CreateAxiosDefaults = {
    // 设置请求的超时时间为10秒
    timeout: TEN_SECONDS,
    // 设置请求头的'Content-Type'为'application/json'
    headers: {
      'Content-Type': 'application/json',
    },
    // 使用isHttpSuccess函数来验证HTTP状态码
    validateStatus: isHttpSuccess,
    // 将参数序列化为查询字符串形式
    paramsSerializer: (params) => {
      return stringify(params)
    },
  }
  // 将传入的配置对象config合并到axiosConfig中，覆盖相同的属性
  Object.assign(axiosConfig, config)
  // 返回合并后的Axios配置对象
  return axiosConfig
}
