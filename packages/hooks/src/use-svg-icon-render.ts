/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-19 11:47:00
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 11:53:04
 * @Description:
 */
import { h } from 'vue'
import type { Component, VNode } from 'vue'

/**
 * @description: 自定义Hook用于渲染SVG图标。此Hook接收一个SVG图标组件并返回生成相应VNode的函数。
 * @param {Component} SvgIcon - SVG图标组件。
 * @return 生成SvgIconVNode的函数。
 */
export default function useSvgIconRender(SvgIcon: Component) {
  interface IconConfig {
    /** Iconify图标名称 */
    icon?: string
    /** 本地图标名称 */
    localIcon?: string
    /** 图标颜色 */
    color?: string
    /** 图标大小 */
    fontSize?: number
  }

  /**
   * 图标样式对象类型定义。
   */
  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>

  /**
   * 生成SVG图标VNode。
   *
   * @param {IconConfig} config - 图标的配置对象。
   * @return {VNode | undefined} 返回SVG图标的VNode，如果icon和localIcon都未定义则返回undefined。
   */
  const SvgIconVNode = (config: IconConfig): VNode | undefined => {
    const { color, fontSize, icon, localIcon } = config

    // 确保 icon 和 localIcon 是字符串类型
    const safeIcon = typeof icon === 'string' ? icon : ''
    const safeLocalIcon = typeof localIcon === 'string' ? localIcon : ''

    const style: IconStyle = {
      ...(color && { color }),
      ...(fontSize && { fontSize: `${fontSize}px` }),
    }

    if (!safeIcon && !safeLocalIcon) {
      return undefined
    }

    return h(SvgIcon, { icon: safeIcon, localIcon: safeLocalIcon, style })
  }

  return {
    SvgIconVNode,
  }
}
