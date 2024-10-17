/**
 * 请求状态接口。
 *
 * 该接口定义了请求的状态信息，包括是否正在刷新令牌以及错误消息堆栈。
 *
 * @property isRefreshingToken - 是否正在刷新令牌。
 * @property errMsgStack - 请求错误消息堆栈。
 */
export interface RequestInstanceState {
  isRefreshingToken: boolean
  errMsgStack: string[]
}
