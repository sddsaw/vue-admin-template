/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-19 13:36:57
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 13:50:59
 * @Description:
 */
// import type { CustomRoute } from '@elegant-router/types';
// import { layouts, views } from '../elegant/imports';
// import { getRoutePath, transformElegantRoutesToVueRoutes } from '../elegant/transform';

// export const ROOT_ROUTE = {
//   name: 'root',
//   path: '/',
//   redirect: '/',
//   meta: {
//     title: 'root',
//     constant: true,
//   },
// }

// const NOT_FOUND_ROUTE = {
//   name: 'not-found',
//   path: '/:pathMatch(.*)*',
//   component: 'layout.blank$view.404',
//   meta: {
//     title: 'not-found',
//     constant: true,
//   },
// }

/** builtin routes, it must be constant and setup in vue-router */
// const builtinRoutes = [ROOT_ROUTE, NOT_FOUND_ROUTE];

/** create builtin vue routes */
export function createBuiltinVueRoutes() {
  return []
  // return transformElegantRoutesToVueRoutes(builtinRoutes, layouts, views);
}
