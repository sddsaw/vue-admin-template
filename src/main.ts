/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-08-29 14:07:07
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 15:52:06
 * @Description:
 */
import { createApp } from 'vue'
import VueMathjax from 'vue-mathjax-next'
import './plugins/assets'

import App from './App.vue'

createApp(App).use(VueMathjax).mount('#app')
