/*
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-04-29 10:15:59
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-04-29 11:47:35
 * @Description:
 */
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新功能' },
    { value: 'fix', name: 'fix:      bug修复' },
    { value: 'docs', name: 'docs:     仅文档更改' },
    {
      value: 'style',
      name: 'style:    不影响代码含义的更改\n            (空格、格式、缺少分号等，不是 css 的更改)',
    },
    {
      value: 'refactor',
      name: 'refactor: 既不修复 bug 也不添加特性的代码更改',
    },
    {
      value: 'perf',
      name: 'perf:     提高性能的代码更改',
    },
    { value: 'test', name: 'test:     添加缺失的或纠正现有的测试' },
    {
      value: 'chore',
      name: 'chore:    对构建过程或辅助工具的更改\n            以及诸如文档生成之类的库',
    },
    { value: 'revert', name: 'revert:   恢复到提交' },
    { value: 'WIP', name: 'WIP:      工作进行中' },
  ],
  scopes: '',
  usePreparedCommit: false, // to re-use commit from ./.git/COMMIT_EDITMSG
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
