/// / <reference types="vite/client" />
/**
 * 命名空间 Env
 *
 * 用于声明 import.meta 对象的类型
 */
declare namespace Env {
  /** 路由历史模式 */
  type RouterHistoryMode = 'hash' | 'history' | 'memory'

  /** import.meta接口 */
  interface ImportMeta extends ImportMetaEnv {
    /** 应用程序的基础URL */
    readonly VITE_BASE_URL: string
    /** 应用程序的标题 */
    readonly VITE_APP_TITLE: string
    /** 应用程序的描述 */
    readonly VITE_APP_DESC: string
    /** 路由历史模式 */
    readonly VITE_ROUTER_HISTORY_MODE?: RouterHistoryMode
    /** Iconify图标的前缀 */
    readonly VITE_ICON_PREFIX: 'icon'
    /**
     * 本地图标的前缀
     *
     * 此前缀以图标前缀开始
     */
    readonly VITE_ICON_LOCAL_PREFIX: 'local-icon'
    /** 后端服务基础URL */
    readonly VITE_SERVICE_BASE_URL: string
    /**
     * 后端服务的成功代码
     *
     * 收到此代码时表示请求成功
     */
    readonly VITE_SERVICE_SUCCESS_CODE: string
    /**
     * 后端服务的登出代码
     *
     * 收到此代码时表示用户将被登出并重定向到登录页面
     *
     * 使用","分隔多个代码
     */
    readonly VITE_SERVICE_LOGOUT_CODES: string
    /**
     * 后端服务的模态登出代码
     *
     * 收到此代码时表示通过显示模态框将用户登出
     *
     * 使用","分隔多个代码
     */
    readonly VITE_SERVICE_MODAL_LOGOUT_CODES: string
    /**
     * 后端服务的令牌过期代码
     *
     * 收到此代码时表示刷新令牌并重新发送请求
     *
     * 使用","分隔多个代码
     */
    readonly VITE_SERVICE_EXPIRED_TOKEN_CODES: string
    /** 当路由模式为静态时，定义的超级角色 */
    readonly VITE_STATIC_SUPER_ROLE: string
    /**
     * 其他后端服务基础URL
     *
     * 值为JSON格式
     */
    readonly VITE_OTHER_SERVICE_BASE_URL: string
    /**
     * 是否启用HTTP代理
     *
     * 仅在开发环境中有效
     */
    readonly VITE_HTTP_PROXY?: CommonType.YesOrNo
    /**
     * 认证路由模式
     *
     * - Static: 认证路由在前端生成
     * - Dynamic: 认证路由在后端生成
     */
    readonly VITE_AUTH_ROUTE_MODE: 'static' | 'dynamic'
    /**
     * 首页路由键
     *
     * 仅在认证路由模式为静态时生效，如果路由模式为动态，则首页路由键在后端定义
     */
    readonly VITE_ROUTE_HOME: string
    /**
     * 如果未设置菜单图标时的默认菜单图标
     *
     * Iconify图标名称
     */
    readonly VITE_MENU_ICON: string
    /** 是否使用源代码映射（Source Map）构建 */
    readonly VITE_SOURCE_MAP?: CommonType.YesOrNo
    /**
     * Iconify API提供商URL
     *
     * 如果项目部署在内网，可以将API提供商URL设置为本地的Iconify服务器
     *
     * @link https://docs.iconify.design/api/providers.html
     */
    readonly VITE_ICONIFY_URL?: string
    /** 用于区分不同域名之间的存储 */
    readonly VITE_STORAGE_PREFIX?: string
  }
}

interface ImportMeta {
  readonly env: Env.ImportMeta
}
