export function openWindow(e: MouseEvent, currentTabId: number) {
  let width = 150
  let height = 150
  let entireTab = false
  // 3.设置将要打开的新窗口的尺寸（分为整个页面和单个要素）
  if ((e.target as HTMLElement) === document.body) {
    width = window.innerWidth
    height = window.innerHeight
    entireTab = true
  }
  else {
    width = Math.round((e.target as HTMLElement).getBoundingClientRect().width)
    height = Math.round((e.target as HTMLElement).getBoundingClientRect().height)
  }

  const newWindowBounds = {
    width,
    height,
    avLeft: (window.screen as any).availLeft,
    avTop: (window.screen as any).availTop,
    avWidth: window.screen.availWidth,
    avHeight: window.screen.availHeight,
    entireTab,
  }
  browser.windows.create({
    width: newWindowBounds.width,
    height: newWindowBounds.height,
    tabId: currentTabId,
    type: 'popup',
    focused: true,
    incognito: false,
  })

  // 给元素添加类名
  doTarget(e.target, true)
  _modifyParents(e.target, true)

  function _modifyParents(elem: any, isSet: boolean) {
    if (elem && elem.tagName !== 'BODY') {
      _modifyParents(elem.parentNode, isSet)
      _modifyOne(elem, isSet)
    }
  }

  function _modifyOne(elem: any, isSet: boolean) {
    const child = elem.parentNode.firstChild
    if (child !== elem && child.tagName !== 'SCRIPT' && child.tagName !== 'LINK') {
      switch (child.nodeType) {
        case 1:
          _modifyStyle(child, '__hidden', isSet)
          break
        case 3:
          _hideTextNode(child, isSet)
          break
      }
    }
    _modifyStyle(elem.parentNode, '__parent', isSet)
  }
  function _modifyStyle(elem: any, style: any, isSet: boolean) {
    elem.classList.add(style)
  }

  function _hideTextNode(elem: any, hide: boolean) {
    if (hide) {
      elem.oldValue = elem.nodeValue
      elem.nodeValue = ''
    }
    else {
      elem.nodeValue = elem.oldValue
      delete elem.oldValue
    }
  }

  function doTarget(target: any, selector: any) {
    if (target && target !== document.body) {
      try {
        _modifyTarget(target, true)
        _modifyParents(target, true)
      }
      catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
  }

  function _modifyTarget(target: any, isSet: boolean) {
    _modifyStyle(target, '__target', isSet)
  }
}
