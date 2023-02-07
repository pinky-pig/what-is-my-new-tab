export const contextMenu = () => {
  browser.contextMenus.create({
    title: '右键快捷菜单', // 菜单的名称
    id: '10', // 一级菜单的id
    contexts: ['page'], // page表示页面右键就会有这个菜单，如果想要当选中文字时才会出现此右键菜单，用：selection
    onclick(_info, _tab) {
      window.open('http://news.baidu.com/#index/cxPurchaseinfo/cxGoodsPurchases', '百度新闻', '')
    },
  })

  browser.contextMenus.create({
    title: '百度', // 菜单的名称
    id: '1101', // 二级菜单的id
    parentId: '10', // 表示父菜单是“右键快捷菜单”
    contexts: ['page'],
    onclick(_info, _tab) {
      window.open('http://news.baidu.com/#index/cxPurchaseinfo/cxGoodsPurchases', '百度新闻', '')
    },
  })

  browser.contextMenus.create({
    title: '测试', // 菜单的名称
    parentId: '10', // 表示父菜单是“右键快捷菜单”
    id: '1102',
    contexts: ['page'], // 在哪种要素上点击右键的时候可以显示出来
    onclick(_info, _tab) {
      window.open('http://news.baidu.com/#index/cxPurchaseinfo/cxGoodsPurchases', '百度新闻', '')
    },
  })
}
