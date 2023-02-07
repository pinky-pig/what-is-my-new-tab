// https://developer.chrome.com/docs/extensions/reference/topSites/

/**
 * 获取chrome浏览器最常使用网址（这里使用的是webextension-polyfill，原生的写法略有一点点不同）
 * @returns{ title: string, url: string }
 */
export async function getBrowserTopSites() {
  return new Promise((resolve) => {
    browser.topSites.get().then((res) => {
      resolve(res)
    })
  })
}
