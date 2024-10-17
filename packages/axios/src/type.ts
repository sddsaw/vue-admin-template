import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
/**
 * 定义HTTP内容类型枚举
 *
 * 列出了常用的HTTP内容类型（MIME类型），用于指定HTTP请求或响应的实体主体的格式。
 *
 * @enum {string}
 * @property {'text/html'} text/html - HTML格式文档
 * @property {'text/plain'} text/plain - 纯文本格式
 * @property {'multipart/form-data'} multipart/form-data - 用于文件上传及表单数据提交
 * @property {'application/json'} application/json - JSON格式数据
 * @property {'application/x-www-form-urlencoded'} application/x-www-form-urlencoded - URL-encoded的表单数据
 * @property {'application/octet-stream'} application/octet-stream - 二进制流数据，常用于文件下载
 */
export type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream'
/**
 * 定义了请求选项接口
 *
 * 此接口包含了处理请求和响应的各种钩子函数，用于自定义请求行为和错误处理
 */
export interface RequestOption<ResponseData = any> {
  /**
   * 请求前的钩子
   *
   * 例如：可以在该钩子中添加请求头中的token
   *
   * @param config Axios配置对象
   */
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  /**
   * 检查后端响应是否成功的钩子
   *
   * @param response Axios响应对象
   */
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean
  /**
   * 后端请求失败后的钩子
   *
   * 例如：可以在该钩子中处理过期的token
   *
   * @param response Axios响应对象
   * @param instance Axios实例
   */
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance
  ) => Promise<AxiosResponse | null> | Promise<void>
  /**
   * 当响应类型为json时转换后端响应
   *
   * @param response Axios响应对象
   */
  transformBackendResponse: (response: AxiosResponse<ResponseData>) => any | Promise<any>
  /**
   * 处理错误的钩子
   *
   * 例如：可以在该钩子中显示错误信息
   *
   * @param error Axios错误对象
   */
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>
}
/**
 * 定义了响应数据类型映射接口
 *
 * 该接口列举了不同类型的响应数据，用于将axios响应数据转换为具体的数据类型
 */
interface ResponseMap {
  /**
   * 二进制大对象，适合处理图片、文件等二进制数据
   */
  blob: Blob
  /**
   * 字符串，通常用于文本数据
   */
  text: string
  /**
   * 数组缓冲区，可以用来处理原始二进制数据
   */
  arrayBuffer: ArrayBuffer
  /**
   * 可读流，适合处理大量数据流式传输，如音频、视频等
   */
  stream: ReadableStream<Uint8Array>
  /**
   * 文档对象，常用于处理XML或HTML响应内容
   */
  document: Document
}
/**
 * 定义了响应类型联合类型
 *
 * 此类型包含了`ResponseMap`接口中的键以及额外的'json'类型，
 * 用于指定请求的响应类型
 */
export type ResponseType = keyof ResponseMap | 'json'
/**
 * 定义了一个映射类型
 *
 * 此类型根据给定的响应类型 `R` 返回对应的响应数据类型。
 * 如果 `R` 是 `ResponseMap` 中的一个键，则返回该键对应的类型；
 * 否则，返回默认的 `JsonType` 类型
 */
export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap
  ? ResponseMap[R]
  : JsonType
/**
 * 定义了自定义的Axios请求配置类型
 *
 * 此类型扩展了标准的Axios请求配置，允许指定自定义的响应类型 `R`。
 * 默认情况下，`responseType` 为 'json'，可以覆盖为其他有效的响应类型
 */
export type CustomAxiosRequestConfig<R extends ResponseType = 'json'> = Omit<AxiosRequestConfig, 'responseType'> & {
  responseType?: R
}
/**
 * 定义了请求实例的通用接口
 *
 * 此接口提供了取消单个或全部请求的方法，以及一个用于存放自定义状态的属性
 */
export interface RequestInstanceCommon<T> {
  /**
   * 根据请求ID取消请求
   *
   * 如果请求配置中提供了AbortController信号，则不会被收集进AbortController映射表中
   *
   * @param requestId 请求的唯一标识符
   */
  cancelRequest: (requestId: string) => void
  /**
   * 取消所有请求
   *
   * 如果请求配置中提供了AbortController信号，则同样不会被收集进AbortController映射表中
   */
  cancelAllRequest: () => void
  /**
   * 允许在请求实例上设置自定义状态
   */
  state: T
}

/**
 * 定义了请求实例接口
 *
 * 此接口继承了 `RequestInstanceCommon` 接口，并扩展了发送请求的功能
 */
export interface RequestInstance<S = Record<string, unknown>> extends RequestInstanceCommon<S> {
  /**
   * 发送请求并返回Promise
   *
   * @param config 自定义的Axios请求配置
   * @returns 响应数据的Promise，类型取决于指定的响应类型 `R`
   */
  <T = any, R extends ResponseType = 'json'>(config: CustomAxiosRequestConfig<R>): Promise<MappedType<R, T>>
}
/**
 * 定义了扁平化的成功响应数据接口
 *
 * 包含数据和错误信息，成功时错误信息为null
 */
export interface FlatResponseSuccessData<T = any> {
  data: T
  error: null
}
/**
 * 定义了扁平化的失败响应数据接口
 *
 * 包含数据和错误信息，失败时数据为null
 */
export interface FlatResponseFailData<ResponseData = any> {
  data: null
  error: AxiosError<ResponseData>
}
/**
 * 定义了扁平化的响应数据联合类型
 *
 * 包含成功和失败两种情况
 */

export type FlatResponseData<T = any, ResponseData = any> =
  | FlatResponseSuccessData<T>
  | FlatResponseFailData<ResponseData>
/**
 * 定义了扁平化请求实例接口
 *
 * 此接口继承了 `RequestInstanceCommon` 接口，并扩展了发送请求的功能，返回扁平化的响应数据
 */
export interface FlatRequestInstance<S = Record<string, unknown>, ResponseData = any> extends RequestInstanceCommon<S> {
  <T = any, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<FlatResponseData<MappedType<R, T>, ResponseData>>
}
