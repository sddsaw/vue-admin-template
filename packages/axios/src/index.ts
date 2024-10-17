// https://blog.csdn.net/weixin_60968779/article/details/125922631
import axios, { AxiosError } from 'axios'
import type { AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'
import { nanoid } from '@space/utils'
import { createAxiosConfig, createDefaultOptions, createRetryOptions } from './options'
import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant'
import type {
  CustomAxiosRequestConfig,
  FlatRequestInstance,
  MappedType,
  RequestInstance,
  RequestOption,
  ResponseType,
} from './type'

/**
 * 创建一个通用的请求函数，用于生成配置好的axios实例和其他相关功能
 *
 * @param axiosConfig 可选的axios默认配置参数，用于初始化axios实例
 * @param options 可选的请求选项，包含一些自定义的配置和请求处理逻辑
 * @returns 返回一个对象，包含axios实例、默认选项、取消请求和取消所有请求的方法
 */
function createCommonRequest<ResponseData = any>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  // 创建默认的请求选项
  const opts = createDefaultOptions<ResponseData>(options)
  // 创建并配置axios实例
  const axiosConf = createAxiosConfig(axiosConfig)
  const instance = axios.create(axiosConf)
  // 用于存储请求的AbortController
  const abortControllerMap = new Map<string, AbortController>()

  // 创建重试选项，并应用到axios实例上
  const retryOptions = createRetryOptions(axiosConf)
  axiosRetry(instance, retryOptions)
  // 拦截请求，进行配置处理
  instance.interceptors.request.use((conf) => {
    const config: InternalAxiosRequestConfig = { ...conf }

    // 设置请求ID
    const requestId = nanoid()
    config.headers.set(REQUEST_ID_KEY, requestId)

    // 配置AbortController
    if (!config.signal) {
      const abortController = new AbortController()
      config.signal = abortController.signal
      abortControllerMap.set(requestId, abortController)
    }

    // 通过钩子处理配置
    const handledConfig = opts.onRequest?.(config) || config

    return handledConfig
  })
  // 拦截响应，进行处理
  instance.interceptors.response.use(
    async (response) => {
      const responseType: ResponseType = (response.config?.responseType as ResponseType) || 'json'
      // 如果响应类型不是json或者后端请求成功，则直接返回响应
      if (responseType !== 'json' || opts.isBackendSuccess(response)) {
        return Promise.resolve(response)
      }
      // 处理后端错误
      const fail = await opts.onBackendFail(response, instance)
      if (fail) {
        return fail
      }

      const backendError = new AxiosError<ResponseData>(
        'the backend request error',
        BACKEND_ERROR_CODE,
        response.config,
        response.request,
        response,
      )
      // 处理错误
      await opts.onError(backendError)

      return Promise.reject(backendError)
    },
    async (error: AxiosError<ResponseData>) => {
      // 处理错误
      await opts.onError(error)

      return Promise.reject(error)
    },
  )
  /**
   * 取消指定的请求
   *
   * 此函数通过请求ID来取消一个正在进行的异步请求如果请求ID在abortControllerMap中找到，
   * 则对应的abortController会被触发，从而取消请求随后，该请求ID从abortControllerMap中被移除
   *
   * @param requestId 请求的唯一标识符，用于在abortControllerMap中查找对应的abortController
   */
  function cancelRequest(requestId: string) {
    // 从Map中获取与请求ID关联的AbortController实例
    const abortController = abortControllerMap.get(requestId)
    // 如果找到了对应的AbortController，则触发abort方法以取消请求，并从Map中移除该请求ID
    if (abortController) {
      abortController.abort()
      abortControllerMap.delete(requestId)
    }
  }
  /**
   * 取消所有正在进行的请求
   *
   * 本函数通过遍历abortControllerMap中的所有AbortController实例来实现请求的取消，
   * 调用abort方法以中断关联的请求，然后清空abortControllerMap。
   * 这样做可以确保不再接收响应，并且清理不再需要的资源。
   */
  function cancelAllRequest() {
    // 遍历abortControllerMap，中断每个请求
    abortControllerMap.forEach((abortController) => {
      abortController.abort()
    })
    // 清空abortControllerMap，以便下一批请求可以使用新的AbortController实例
    abortControllerMap.clear()
  }

  return {
    instance,
    opts,
    cancelRequest,
    cancelAllRequest,
  }
}

/**
 * 创建请求实例的函数
 *
 * 此函数用于创建一个请求实例，该实例可以用来发送HTTP请求，并处理响应或错误
 * 它使用了axios库进行HTTP通信，并提供了一些额外的功能，如请求取消和响应数据转换
 *
 * @template ResponseData 响应数据的类型，默认为any
 * @template State 状态对象的类型，默认为Record<string, unknown>
 * @param axiosConfig axios配置对象，用于配置axios实例的默认参数
 * @param options 请求选项对象，包含一些请求的默认选项，如超时时间、基础URL等
 * @returns 返回一个请求实例，该实例可以用来发送请求
 */
export function createRequest<ResponseData = any, State = Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  // 创建通用请求的基础设施，包括axios实例、请求取消函数等
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest<ResponseData>(axiosConfig, options)

  // 定义请求实例的内部请求函数
  const request: RequestInstance<State> = async function request<T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig,
  ) {
    // 发送HTTP请求并接收响应
    const response: AxiosResponse<ResponseData> = await instance(config)

    // 获取响应类型，默认为json
    const responseType = response.config?.responseType || 'json'
    // 根据响应类型处理响应数据
    if (responseType === 'json') {
      // 如果是json类型，则转换并返回后端响应数据
      return opts.transformBackendResponse(response)
    }
    // 对于非json类型的响应，按类型返回数据
    return response.data as MappedType<R, T>
  } as RequestInstance<State>
  // 给请求实例添加请求取消功能
  request.cancelRequest = cancelRequest
  // 给请求实例添加取消所有请求的功能
  request.cancelAllRequest = cancelAllRequest
  // 初始化请求实例的状态对象
  request.state = {} as State
  // 返回请求实例
  return request
}

/**
 * 创建一个扁平化的请求函数，用于发送HTTP请求并处理响应。
 *
 * @template ResponseData - 响应数据的类型，默认为any。
 * @template State - 请求状态的类型，默认为Record<string, unknown>。
 * @param axiosConfig - 可选的Axios配置默认值，用于初始化Axios实例。
 * @param options - 可选的请求选项，包括对响应数据的转换处理。
 * @returns 返回一个扁平化的请求实例，该实例可以发送HTTP请求并处理响应。
 */
export function createFlatRequest<ResponseData = any, State = Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData>>,
) {
  // 创建通用请求逻辑，返回Axios实例及相关函数。
  const { instance, opts, cancelRequest, cancelAllRequest } = createCommonRequest<ResponseData>(axiosConfig, options)
  // 定义扁平化的请求实例函数，用于实际发送请求。
  const flatRequest: FlatRequestInstance<State, ResponseData> = async function flatRequest<
    T = any,
    R extends ResponseType = 'json',
  >(config: CustomAxiosRequestConfig) {
    try {
      // 发送请求并获取响应。
      const response: AxiosResponse<ResponseData> = await instance(config)
      // 获取响应类型，默认为'json'。
      const responseType = response.config?.responseType || 'json'
      // 根据响应类型处理响应数据。
      if (responseType === 'json') {
        // 对后端响应数据进行转换处理。
        const data = opts.transformBackendResponse(response)
        // 返回处理后的数据，无错误。
        return { data, error: null }
      }
      // 根据响应类型返回相应的数据，无错误。
      return { data: response.data as MappedType<R, T>, error: null }
    }
    catch (error) {
      // 捕获异常，返回null数据及错误信息。
      return { data: null, error }
    }
  } as FlatRequestInstance<State, ResponseData>
  // 为扁平化的请求实例函数添加取消单个请求和取消所有请求的功能。
  flatRequest.cancelRequest = cancelRequest
  flatRequest.cancelAllRequest = cancelAllRequest
  // 初始化请求状态。
  flatRequest.state = {} as State
  // 返回扁平化的请求实例函数。
  return flatRequest
}

export { BACKEND_ERROR_CODE, REQUEST_ID_KEY }
export type * from './type'
export type { CreateAxiosDefaults, AxiosError }
