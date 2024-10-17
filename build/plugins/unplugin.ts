/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-10-17 21:56:11
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-10-17 22:23:05
 * @Description:
 */
import process from 'node:process'
import path from 'node:path'
import type { PluginOption } from 'vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
/**
 * 设置Unplugin插件配置
 * 该函数根据Vite环境变量配置本地图标路径和插件选项，以集成图标库和组件库
 * @param viteEnv Vite环境变量，包含项目配置信息
 * @returns 返回一个插件选项数组，用于Vite构建配置
 */
export function setupUnplugin(viteEnv: Env.ImportMeta) {
  // 从环境变量中解构出图标前缀和本地图标前缀
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv
  // 获取本地图标资源路径
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon')
  // 计算自定义图标集合名称
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '')
  // 定义插件数组，包含图标加载和组件自动引入的配置
  const plugins: PluginOption[] = [
    // 配置图标插件，使用Vue3编译器，自定义图标加载器，统一图标大小和样式
    Icons({
      compiler: 'vue3',
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, (svg: string) =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')),
      },
      scale: 1,
      defaultClass: 'inline-block',
    }),
    // 配置组件自动引入插件，生成类型声明文件，自动引入路由组件和图标组件
    Components({
      dts: 'src/types/components.d.ts',
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ customCollections: [collectionName], componentPrefix: VITE_ICON_PREFIX }),
      ],
    }),
    // 配置本地SVG图标插件，将本地图标注册为Web组件，便于全局使用
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      inject: 'body-last',
      customDomId: '__SVG_ICON_LOCAL__',
    }),
  ]
  // 返回插件配置数组
  return plugins
}
