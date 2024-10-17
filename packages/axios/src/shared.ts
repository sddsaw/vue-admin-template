/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-04 15:02:51
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-04 15:46:44
 * @Description:
 */
import type { AxiosHeaderValue, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
/**
 * 获取请求的Content-Type类型
 *
 * 此函数用于从配置对象中获取Content-Type的值如果配置对象中未指定Content-Type，
 * 则默认返回'application/json'
 *
 * @param config 内部Axios请求配置对象，包含请求的所有参数
 * @returns 返回请求的Content-Type类型
 */
export function getContentType(config: InternalAxiosRequestConfig) {
  // 从请求配置的头部信息中获取Content-Type，如果不存在，则使用默认值'application/json'
  const contentType: AxiosHeaderValue = config.headers?.['Content-Type'] || 'application/json'

  return contentType
}

/**
 * 判断HTTP请求是否成功
 *
 * 本函数用于判断给定的HTTP状态码是否表示一个成功的请求默认情况下，
 * HTTP状态码在200到299之间的码表示成功此外，状态码304（未修改）也视为成功
 *
 * @param status HTTP状态码，用于表示HTTP请求的结果
 * @returns 返回布尔值，如果请求成功则为true，否则为false
 */
export function isHttpSuccess(status: number) {
  // 判断状态码是否为成功码
  const isSuccessCode = status >= 200 && status < 300
  // 返回判断结果，将304状态码也视为成功
  return isSuccessCode || status === 304
}

/**
 * 判断Axios响应是否为JSON格式
 *
 * 本函数通过检查Axios响应的配置中的responseType属性来判断响应格式是否为JSON
 * responseType属性表示服务器响应的数据类型，当其值为'json'或未定义时，表明响应为JSON格式
 *
 * @param response Axios响应对象，包含服务器的响应和配置信息
 * @returns 如果响应是JSON格式，则返回true；否则返回false
 */
export function isResponseJson(response: AxiosResponse) {
  const { responseType } = response.config

  return responseType === 'json' || responseType === undefined
}
