declare namespace ApiAuth {
  interface LoginToken {
    token: string
    refreshToken: string
  }

  interface UserInfo {
    userId: string
    userName: string
    roles: string[]
    buttons: string[]
  }
}
