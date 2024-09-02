/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-04-29 10:15:59
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-08-29 15:55:18
 * @Description:
 */
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新的功能' },
    { value: 'fix', name: 'fix:      bug修复' },
    { value: 'docs', name: 'docs:     只修改文档' },
    { value: 'style', name: 'style:    不影响代码含义的修改（比如：空格、格式化、添加缺少的分号等' },
    { value: 'refactor', name: 'refactor: 重构代码（既不修复错误，也不增加功能）' },
    { value: 'perf', name: 'perf:     提高性能' },
    { value: 'test', name: 'test:     添加缺失的或纠正现有的测试' },
    { value: 'build', name: 'build:    影响构建系统或外部依赖的变化（如glup、npm等）' },
    { value: 'chore', name: 'chore:    其它不修改src或测试文件的改动' },
    { value: 'revert', name: 'revert:   回滚之前的提交' },
  ],
  scopes: '',
  usePreparedCommit: false,
  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',
  skipQuestions: ['body'],
  messages: {
    type: '选择您要进行的更改类型\'重新提交:',
    scope: '\n表示此更改的范围(可选):',
    customScope: '表示此更改的范围:',
    subject: '写一个简短的，祈使句式的变化描述(必选):\n',
    body: '提供更长的变更描述(可选)。使用"|"换行:\n',
    breaking: '列出任何重大更改(可选):\n',
    footer: '列出此更改关闭的任何问题(可选):\n',
    confirmCommit: '您确定要继续执行上面的提交吗?',
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  subjectLimit: 100,
}
