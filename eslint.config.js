/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-08-29 14:18:29
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-08-29 14:47:22
 * @Description: 
 */
import antfu from '@antfu/eslint-config'
// export default antfu(
//   {
//     vue: true,
//     typescript: true,
//   },
//   {
//     files: ['**/*.vue'],
//     rules: { },
//   },
//   {
//     files: ['**/*.ts'],
//     rules: { },
//   },
//   {
//     // 没有“文件”，它们是所有文件的通用规则
//     rules: {
//       'curly': 'error',
//       'no-console': 'off',
//     },
//   },
// )
export default antfu(
  {
    unocss: true,
    vue: true,
    typescript: true,
  },
  {
    files: ['**/*.vue'],
    rules: { },
  },
  {
    files: ['**/*.ts'],
    rules: { },
  },
  {
    rules: {
      'curly': 'error',
      'no-console': 'off',
      "vue/max-attributes-per-line": [2, {
        "singleline": 5,
        "multiline": {
          "max": 1,
          "allowFirstLine": false
        }
      }]
    },
  }
)
