/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-19 11:43:51
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 11:45:36
 * @Description:
 */
import useBoolean from './use-boolean'

/**
 * @description: 定义一个用于控制加载状态的钩子，此钩子初始化时可以选择是否处于加载状态，并提供启动和结束加载状态的方法
 * @param initValue 初始化时的加载状态，默认为false，表示未加载
 * @returns 返回当前的加载状态以及改变状态的两个方法
 */
export default function useLoading(initValue = false) {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue)

  return {
    loading,
    startLoading,
    endLoading,
  }
}
