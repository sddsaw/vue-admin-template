/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-10 16:07:18
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-10 17:55:43
 * @Description:
 */
import type { PiniaPluginContext } from 'pinia'
import { jsonClone } from '@space/utils'
import { SetupStoreId } from '@/enum'

/**
 * 重置设置商店的插件
 *
 * 此函数旨在为特定的Pinia商店重置其设置状态它通过检查商店的ID是否为设置商店ID之一，
 * 如果是，则克隆商店的初始状态，并定义一个$reset方法用于将状态重置为初始状态
 *
 * @param context Pinia插件上下文，包含需要重置的商店
 */
export function resetSetupStore(context: PiniaPluginContext) {
  // 获取所有设置商店ID的值，并将其转换为字符串数组
  const setupSyntaxIds = Object.values(SetupStoreId) as string[]

  // 检查当前商店的ID是否包含在设置商店ID数组中
  if (setupSyntaxIds.includes(context.store.$id)) {
    // 获取商店的状态
    const { $state } = context.store

    // 克隆并保存商店的默认状态
    const defaultStore = jsonClone($state)

    // 定义商店的$reset方法
    context.store.$reset = () => {
      // 将商店的状态重置为默认状态
      context.store.$patch(defaultStore)
    }
  }
}
