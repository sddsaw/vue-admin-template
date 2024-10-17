import type { AxiosResponse } from 'axios'
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@space/axios'
import { handleRefreshToken, showErrorMsg } from './shared'
import type { RequestInstanceState } from './type'
import { useAuthStore } from '@/store/modules/auth'
import { localStg } from '@/utils/storage'
import { getServiceBaseURL } from '@/utils/service'

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y'
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy)

/**
 * @description: 返回的请求实例会将响应数据和错误信息包装在一个扁平的对象中，以统一的格式返回结果。
 * @return {*}
 */
export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2',
    },
  },
  {
    /**
     * 异步函数 onRequest，在请求发出之前对配置对象进行处理。
     * 主要功能是向请求头中添加授权令牌（Authorization）。
     *
     * @param {object} config - 请求的配置对象，包含请求的各种参数，如URL、方法和头信息。
     * @returns {object} 返回经过处理的配置对象，以便于后续请求使用。
     */
    async onRequest(config) {
      const { headers } = config

      // 从本地存储中获取用户令牌
      const token = localStg.get('token')
      // 根据获取的令牌设置请求头中的Authorization字段
      const Authorization = token ? `Bearer ${token}` : null
      Object.assign(headers, { Authorization })
      // 返回更新后的配置对象
      return config
    },
    /**
     * 判断后端请求是否成功
     *
     * @param response - 后端响应对象，包含数据和状态码等信息
     * @returns 如果后端响应码为"0000"（默认值），则表示请求成功，函数返回true；否则返回false
     *
     * 注意：你可以通过修改`.env`文件中的`VITE_SERVICE_SUCCESS_CODE`来更改默认的成功响应码
     */
    isBackendSuccess(response) {
      // 当后端响应码为"0000"（默认值）时，表示请求成功
      // 若要修改这一逻辑，你可以更改`.env`文件中的`VITE_SERVICE_SUCCESS_CODE`
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE
    },
    /**
     * 处理后端错误响应的异步方法
     * 当后端响应出现特定错误码时，执行相应的处理逻辑，如用户登出、刷新令牌等
     * @param response 错误响应对象，包含后端返回的错误信息
     * @param instance Axios实例，用于发送HTTP请求
     * @returns 返回Promise对象，可能包含Axios响应或为null
     */
    async onBackendFail(response, instance) {
      // 使用authStore来管理认证状态
      const authStore = useAuthStore()
      // 将响应中的错误码转换为字符串，以便于后续比较
      const responseCode = String(response.data.code)
      /**
       * 执行用户登出操作，清除authStore中的信息
       */
      function handleLogout() {
        authStore.resetStore()
      }
      // 用于配置用户登出并清理错误消息栈的逻辑
      // function logoutAndCleanup() {
      //   handleLogout()
      //   window.removeEventListener('beforeunload', handleLogout)

      //   request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg)
      // }

      // 从环境变量中获取需要直接登出用户的错误码列表
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || []
      // 如果响应码在需要登出的码列表中，执行登出操作并返回null
      if (logoutCodes.includes(responseCode)) {
        handleLogout()
        return null
      }

      // 从环境变量中获取需要显示模态框提示用户登出的错误码列表
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || []
      // 如果响应码在模态框登出码列表中且错误消息栈未包含该消息，则添加错误消息到栈中
      if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(response.data.msg)) {
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg]

        // 阻止用户刷新页面
        window.addEventListener('beforeunload', handleLogout)
        // 弹出模态框，提示用户登出
        // window.$dialog?.error({
        //   title: $t('common.error'),
        //   content: response.data.msg,
        //   positiveText: $t('common.confirm'),
        //   maskClosable: false,
        //   closeOnEsc: false,
        //   onPositiveClick() {
        //     logoutAndCleanup()
        //   },
        //   onClose() {
        //     logoutAndCleanup()
        //   },
        // })

        return null
      }

      // 弹出模态框，提示用户登出
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || []
      // 如果响应码表示令牌过期且当前未在刷新令牌过程中，则开始刷新令牌
      if (expiredTokenCodes.includes(responseCode) && !request.state.isRefreshingToken) {
        request.state.isRefreshingToken = true
        // 调用刷新令牌的处理函数，可能返回新的配置
        const refreshConfig = await handleRefreshToken(response.config)

        request.state.isRefreshingToken = false
        // 如果有新的配置，则使用新的配置重新发送请求
        if (refreshConfig) {
          return instance.request(refreshConfig) as Promise<AxiosResponse>
        }
      }
      // 如果所有条件都不满足，则返回null
      return null
    },
    /**
     * 转换后端响应
     *
     * 该方法用于处理后端返回的响应，提取出响应数据中的具体数据部分
     * 主要是为了统一处理响应格式，为后续的数据处理提供方便
     *
     * @param response 后端响应对象，预期该对象包含两层data属性
     * @returns 返回处理后的响应数据，即最内层的data属性内容
     */
    transformBackendResponse(response) {
      return response.data.data
    },
    /**
     * 处理错误响应的函数
     * 当请求失败时，可以通过此函数展示错误信息
     *
     * @param error 错误对象，包含请求失败的信息
     */
    onError(error) {
      // 当请求失败时，用于显示错误信息的地方

      let message = error.message
      let backendErrorCode = ''

      // 获取后端的错误信息和错误代码
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message
        backendErrorCode = String(error.response?.data?.code || '')
      }

      // 根据特定错误代码判断是否在模态框中显示错误信息
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || []
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return
      }

      // 当token过期时，会尝试刷新token并重新请求，所以不需要显示错误信息
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || []
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return
      }
      // 显示错误信息
      showErrorMsg(request.state, message)
    },
  },
)

/**
 * @description: 返回的请求实例直接返回 Axios 响应数据（可转换)
 * @return {*}
 */
export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo,
  },
  {
    /**
     * 异步函数 onRequest，在请求发出之前对配置对象进行处理
     * 主要功能是向请求头中添加授权令牌（Authorization）
     *
     * @param {object} config - 请求配置对象，包含请求的各种信息和设置
     * @returns {object} 返回处理后的请求配置对象
     */
    async onRequest(config) {
      const { headers } = config

      // 根据获取到的令牌设置请求头中的Authorization字段
      // 如果有令牌，则使用Bearer方案设置Authorization
      const token = localStg.get('token')
      const Authorization = token ? `Bearer ${token}` : null
      // 将Authorization字段合并到请求头中
      Object.assign(headers, { Authorization })
      // 返回处理后的请求配置对象
      return config
    },
    /**
     * 判断后端请求是否成功
     *
     * @param {object} response - 后端的响应对象
     * @returns {boolean} - 如果后端响应码为"200"，则表示请求成功
     *
     * 当后端响应码为"200"时，表示请求成功。你可以根据需要自行更改此逻辑
     */
    isBackendSuccess(response) {
      // when the backend response code is "200", it means the request is success
      // you can change this logic by yourself
      return response.data.status === '200'
    },
    /**
     * 处理后端请求失败的异步方法
     * 当后端返回的状态码不是 "200" 时，表示请求失败
     * 此方法可用于处理例如令牌过期的情况，通过刷新令牌并重新尝试请求
     *
     * @param _response - 来自后端的响应对象，包含状态码等信息
     */
    async onBackendFail(_response) {
      // 举例说明：当响应代码不是 "200"，可能需要进行的操作
      // 例如: 刷新令牌并重新尝试请求
    },
    /**
     * 转换后端响应
     *
     * 该方法用于处理后端返回的响应，提取出响应数据中的结果部分
     * 主要用于过滤或处理原始响应数据，确保上层使用时数据格式一致且干净
     *
     * @param {object} response - 待处理的后端响应对象
     * @returns {any} 返回处理后的响应结果
     */
    transformBackendResponse(response) {
      return response.data.result
    },
    /**
     * 处理错误的函数
     * 当异步请求失败时，可以使用此函数显示错误信息
     *
     * @param {object} error - 错误对象，通常包含错误代码和信息
     */
    onError(error) {
      // 当请求失败时，你可以显示错误信息

      // let message = error.message

      // 显示后端错误信息
      if (error.code === BACKEND_ERROR_CODE) {
        // message = error.response?.data?.message || message
      }

      // window.$message?.error(message)
    },
  },
)
