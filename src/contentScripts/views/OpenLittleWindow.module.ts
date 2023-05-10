import { useStyleTag } from '@vueuse/core'
import windowsCss from './windows.css?raw'

let cssId = ''
export function openWindow(ele: HTMLElement, currentTabId: number) {
  // 给元素添加类名
  doTarget(ele, true)
  _modifyParents(ele, true)

  if (!cssId)
    cssId = useStyleTag(windowsCss).id

  function doTarget(target: any, selector: any) {
    if (target && target !== document.body) {
      try {
        _modifyTarget(target, true)
        _modifyParents(target, true)
      }
      catch (e) {
        errorRestore(target)
      }
    }
  }

  function _modifyTarget(target: any, isSet: boolean) {
    _modifyStyle(target, '__target', isSet)
  }

  function _modifyStyle(elem: any, style: any, isSet: boolean) {
    elem.classList.add(style)
  }

  function errorRestore(target: HTMLElement) {
    _modifyTarget(target, false)
    document.querySelectorAll('.__hidden,.__parent')
      .forEach(elem => elem.classList.remove('__hidden', '__parent'))
  }

  function _modifyParents(elem: any, isSet: boolean) {
    if (elem && elem.tagName !== 'BODY') {
      _modifyParents(elem.parentNode, isSet)
      _modifyOne(elem, isSet)
    }
  }

  function _modifyOne(elem: any, isSet: boolean) {
    const siblings = Array.from(elem.parentNode.children) as HTMLElement[]
    siblings.forEach((child) => {
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
    })
    _modifyStyle(elem.parentNode, '__parent', isSet)
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
}
