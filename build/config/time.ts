/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-10-17 21:46:19
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-10-17 21:46:39
 * @Description:
 */
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

/**
 * 获取构建时间
 *
 * 此函数用于获取当前时间，并将其格式化为上海时区的日期和时间
 * 使用dayjs库来处理日期和时间，因为其提供了强大的时间处理功能，包括时区转换
 *
 * @returns {string} 返回格式化的当前时间，格式为'YYYY-MM-DD HH:mm:ss'
 */
export function getBuildTime() {
  // 扩展dayjs库以支持UTC和时区插件
  dayjs.extend(utc)
  dayjs.extend(timezone)
  // 获取当前时间，并将其转换为上海时区的时间，然后格式化为'YYYY-MM-DD HH:mm:ss'格式
  const buildTime = dayjs.tz(Date.now(), 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')

  return buildTime
}
