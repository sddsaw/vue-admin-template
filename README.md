<!--
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-04-26 15:29:24
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-02 15:44:48
 * @Description:
-->

### 安装pnpm
1.npm i pnpm -g
2.pnpm config get registry //查看源 ；
3.pnpm config set registry https://registry.npmmirror.com //切换淘宝源

### 项目的基础建设 第三方包

- 安装 @antfu/eslint-config pnpx @antfu/eslint-config@latest =>安装完后进行测试eslint规则
- lint-staged
- husky
- commitlint/cli && @commitlint/config-conventional 验证commit提交规范
- commitizen 提供一个 commit 格式化或交互工具
- cz-customizable 可定制的commit插件 定制一套符合自己或者团队的规范。
- commit-and-tag-version 生成版本号
- 安装only-allow 包管理工具
- 创建.npmrc文件  锁定配置npm源，统一项目node版本与包管理器 https://blog.csdn.net/qq_43440532/article/details/121949990
- 配置EditorConfig文件对不同编译器进行控制
- 添加.gitignpre忽略文件
### 项目依赖 配置
配置路径别名 需要安装@type/node 用来补充nodejs的类型，在tsconfig.json需要添加baseUrl和paths
安装vueuse/core库 为了使用vue自带的hooks

### 使用pnpm workspace
1、添加pnpm-workspace.yaml文件，内容如下：
packages:
-'packages/*'
2.新建packages目录 在子目录里面是用pnpm init生成package.json文件 修改name名
根目录执行 pnpm tsc --init 生成ts.config.json文件
在子包中安装其他依赖 pnpm add axios -F @assemble/axios
在根节点安装子包依赖 pnpm add @assemble/axios -wD
清除pnpm缓存 pnpm store prune
#更新项目依赖最新版本 pnpm update
