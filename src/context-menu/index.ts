/* eslint-disable no-console */
export const contextMenu = () => {
  browser.contextMenus.create({
    type: 'normal',
    title: 'Menu Demo',
    id: 'menuDemo',
    contexts: ['all'],
  })

  /**
   * _info: {
        "editable": false,
        "frameId": 0,
        "menuItemId": "littleWindow",
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
  browser.contextMenus.onClicked.addListener((_info, _tab) => {
    if (_info.menuItemId === '小窗口展示') {
      console.log(_info)
      console.log(_tab)
    }
    else if (_info.menuItemId === 'test') {
      window.open('https://www.baidu.com/')
    }
  })

  browser.contextMenus.create({
    parentId: 'menuDemo',
    type: 'normal',
    title: '小窗口展示',
    id: 'littleWindow',
    contexts: ['all'],
  })
  browser.contextMenus.create({
    parentId: 'menuDemo',
    type: 'normal',
    title: '测试',
    id: 'test',
    contexts: ['all'],
  })
}
