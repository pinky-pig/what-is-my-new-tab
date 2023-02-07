// https://developer.chrome.com/docs/extensions/reference/topSites/
interface topSite {
  title: string
  url: string
}
/**
 * 获取chrome浏览器最常使用网址
 * @returns{ title: string, url: string }
 */
export async function getChromeTopSites() {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    chrome.topSites.get(
      (e: topSite[]) => {
        resolve(e)
      },
    )
  })
}
