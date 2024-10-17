/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-10-17 21:55:53
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-10-17 22:01:03
 * @Description:
 */
import process from 'node:process'
import path from 'node:path'
import unocss from '@unocss/vite'
import presetIcons from '@unocss/preset-icons'
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders'
/**
 * 配置 UnoCSS 插件
 *
 * 该函数主要用于在 Vite 项目中配置 UnoCSS 插件，特别是用于处理图标前缀和本地图标路径
 * 它通过读取 Vite 环境变量中的图标前缀和本地图标前缀，来确定图标集合的名称和路径
 *
 * @param viteEnv Vite 环境变量，包含项目配置信息
 * @returns 返回配置好的 UnoCSS 插件实例
 */
export function setupUnocss(viteEnv: Env.ImportMeta) {
  // 从 Vite 环境变量中解构出图标前缀和本地图标前缀
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv

  // 构建本地图标路径，指向项目中的 SVG 图标文件夹
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon')

  // 通过前缀替换，确定图标集合的名称
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '')

  // 返回配置好的 UnoCSS 插件实例
  return unocss({
    presets: [
      presetIcons({
        // 设置图标的前缀
        prefix: `${VITE_ICON_PREFIX}-`,
        // 设置图标的缩放比例
        scale: 1,
        // 为图标设置额外的属性，使其默认为行内块元素
        extraProperties: {
          display: 'inline-block',
        },
        // 配置图标集合，使用文件系统图标加载器加载本地图标
        collections: {
          [collectionName]: FileSystemIconLoader(localIconPath, svg =>
            svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')),
        },
        // 开启警告信息，提醒使用了未识别的图标
        warn: true,
      }),
    ],
  })
}
