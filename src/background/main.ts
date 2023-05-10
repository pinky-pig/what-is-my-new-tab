import { onMessage, sendMessage } from 'webext-bridge'
import type { Tabs } from 'webextension-polyfill'
import { contextMenu } from '~/context-menu'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

browser.runtime.onInstalled.addListener((): void => {
  // eslint-disable-next-line no-console
  console.log('Extension installed')
})

// 1. popup弹出页面
browser.browserAction.onClicked.addListener((_tab) => {
  browser.windows.create({
    url: browser.runtime.getURL('./dist/popup/index.html'),
    width: 400,
    height: 800,
    left: 600,
    type: 'popup',
  })
})
// 2. 右键菜单
contextMenu()

let previousTabId = 0

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
browser.tabs.onActivated.addListener(async ({ tabId }) => {
  if (!previousTabId) {
    previousTabId = tabId
    return
  }

  let tab: Tabs.Tab

  try {
    tab = await browser.tabs.get(previousTabId)
    previousTabId = tabId
  }
  catch {
    return
  }

  // eslint-disable-next-line no-console
  console.log('previous tab', tab)
  sendMessage('tab-prev', { title: tab.title }, { context: 'content-script', tabId })
})

onMessage('get-current-tab', async () => {
  try {
    const tab = await browser.tabs.get(previousTabId)
    return {
      title: tab?.title,
    }
  }
  catch {
    return {
      title: undefined,
    }
  }
})

onMessage('createWindow', async ({ data }) => {
  const { tabId, width, height, className } = data as { tabId: number; width: number; height: number; left: number; top: number;className: string }

  // 将当前窗口弹出，并赋值
  tabId && browser.tabs.duplicate(tabId)
  browser.windows.create({
    width: width > 1920 ? 1920 : width < 200 ? 200 : width,
    height: height > 1080 ? 1080 : height < 200 ? 200 : height,
    tabId,
    type: 'popup',
    focused: true,
    incognito: false,
  }).then((response) => {
    sendMessage('open-tab-prev', { className }, { context: 'content-script', tabId })
  })
})
