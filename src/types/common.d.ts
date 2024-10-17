/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-04 17:38:27
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-10 15:02:42
 * @Description:
 */
/** 常见类型命名空间 */
declare namespace CommonType {
  /**
   * 策略模式接口。
   * 该接口定义了一个条件和一个回调函数，当条件为真时调用回调函数。
   * @property condition - 条件。
   * @property callback - 如果条件为真，则调用此回调函数。
   */
  interface StrategicPattern {
    condition: boolean
    callback: () => void
  }

  /**
   * 选项类型
   * 该类型定义了一个选项，包括选项值和选项标签。
   * @property value: 选项值
   * @property label: 选项标签
   */
  interface Option<K = string> { value: K, label: string }
  /**
   * 是或否类型。
   *
   * 该类型定义了一个枚举，表示是否。
   */
  type YesOrNo = 'Y' | 'N'

  /**
   * 为所有属性添加 null 值。
   *
   * 该类型定义了一个泛型类型，将原始类型的每个属性变为可选，并允许其值为 null。
   *
   * @template T - 原始类型。
   */
  type RecordNullable<T> = {
    [K in keyof T]?: T[K] | null;
  }
}
