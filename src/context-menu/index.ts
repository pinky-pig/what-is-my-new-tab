export function contextMenu() {
  browser.contextMenus.create({
    type: 'normal',
    title: 'Menu Demo',
    id: 'menuDemo',
    contexts: ['all'],
  })

  /**
   * info: {
        "editable": false,
        "frameId": 0,
        "menuItemId": "startSelectBox",
        "pageUrl": "chrome-extension://ickhngjdmohhngnbganehfhhliebfmgd/dist/newtab/index.html",
        "parentMenuItemId": "menuDemo"
      }
   * _tab: {
      "active": true,
      "audible": false,
      "autoDiscardable": true,
      "discarded": false,
      "favIconUrl": "",
      "groupId": -1,
      "height": 808,
      "highlighted": true,
      "id": 1768720768,
      "incognito": false,
      "index": 5,
      "mutedInfo": {
        "muted": false
      },
      "openerTabId": 1768720630,
      "pinned": false,
      "selected": true,
      "status": "complete",
      "title": "新标签页",
      "url": "chrome://newtab/",
      "width": 432,
      "windowId": 1768720354
    }
   */
  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (tab === undefined)
      return
    // 1.选择
    if (info.menuItemId === 'startSelectBox') {
      browser.tabs.sendMessage(tab?.id || 0, { cmd: 'start' })
    }
    // 2.复制
    else if (info.menuItemId === 'openDuplicateWindow') {
      tab.id && browser.tabs.duplicate(tab.id)
    }
    // 3.弹出
    else if (info.menuItemId === 'openPopupWindow') {
      browser.windows.create({
        width: 400,
        height: 800,
        tabId: tab?.id,
        type: 'popup',
        focused: true,
        incognito: false,
      })
    }
    // 4.复制并弹出。接下来就是将弹窗里面的要素盖上一个蒙版，然后将点击选择的要素置顶
    else if (info.menuItemId === 'openPopupAndDuplicateWindow') {
      tab.id && browser.tabs.duplicate(tab.id)
      browser.windows.create({
        width: 400,
        height: 800,
        tabId: tab?.id,
        type: 'popup',
        focused: true,
        incognito: false,
      })
    }
    // 测试用
    else if (info.menuItemId === 'test') {
      // browser.windows.getCurrent().then((tab: any) => {
      //   console.log(tab)
      //   // browser.tabs.duplicate(tab.id).then((res) => {
      //   //   console.log(res)
      //   // })
      // })
    }
  })

  browser.contextMenus.create({
    parentId: 'menuDemo',
    type: 'normal',
    title: '选择框 Esc退出',
    id: 'startSelectBox',
    contexts: ['all'],
  })
  browser.contextMenus.create({
    parentId: 'menuDemo',
    type: 'normal',
    title: '复制当前Tab窗口',
    id: 'openDuplicateWindow',
    contexts: ['all'],
  })
  browser.contextMenus.create({
    parentId: 'menuDemo',
    type: 'normal',
    title: '弹出当前Tab窗口',
    id: 'openPopupWindow',
    contexts: ['all'],
  })
  browser.contextMenus.create({
    parentId: 'menuDemo',
    type: 'normal',
    title: '弹出并复制当前Tab窗口',
    id: 'openPopupAndDuplicateWindow',
    contexts: ['all'],
  })

  browser.contextMenus.create({
    parentId: 'menuDemo',
    type: 'normal',
    title: 'test',
    id: 'test',
    contexts: ['all'],
  })
}
