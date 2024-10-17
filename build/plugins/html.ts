/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-10-17 21:55:28
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-10-17 22:00:24
 * @Description:
 */
import type { Plugin } from 'vite'

/**
 * 设置HTML插件以在HTML头部内添加构建时间的元标签
 * @description: 该函数用于创建一个HTML插件实例，其作用是在HTML文档的<head>标签内添加一个包含构建时间的<meta>标签
 * 这有助于在HTML页面中显示或记录构建时间，以便于调试或版本控制
 * @param {string} buildTime - 构建时间字符串，表示当前项目的构建时间
 * @return {*} 返回一个配置好的插件对象
 */
export function setupHtmlPlugin(buildTime: string) {
  // 定义一个插件对象
  const plugin: Plugin = {
    // 插件的名称
    name: 'html-plugin',
    // 插件的应用阶段，此处为构建阶段
    apply: 'build',
    transformIndexHtml(html) {
      // 在HTML的<head>标签内添加构建时间的<meta>标签
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${buildTime}">`)
    },
  }

  return plugin
}
