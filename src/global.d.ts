declare const __DEV__: boolean

declare module '*.vue' {
  const component: any
  export default component
}

declare module 'three'

interface Window {
  $loadingBar: import('naive-ui').LoadingBarProviderInst
  $dialog: import('naive-ui').DialogProviderInst
  $message: import('naive-ui').MessageProviderInst
  $notification: import('naive-ui').NotificationProviderInst
}
