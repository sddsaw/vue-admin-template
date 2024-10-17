/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-19 11:40:01
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 11:42:05
 * @Description:
 */
import { ref } from 'vue'
/**
 * @description: 定义一个组合式函数useBoolean，用于处理布尔值的状态管理
 * @param {*} initValue -Boolean类型，默认为false
 * @return {*}
 */
export default function useBoolean(initValue = false) {
  const bool = ref(initValue)

  function setBool(value: boolean) {
    bool.value = value
  }

  function setTrue() {
    setBool(true)
  }

  function setFalse() {
    setBool(false)
  }

  function toggle() {
    setBool(!bool.value)
  }

  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle,
  }
}
