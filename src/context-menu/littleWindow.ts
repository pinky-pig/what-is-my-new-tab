/* eslint-disable no-console */
export const watchContextMenuEvent = () => {
  browser.runtime.onMessage.addListener(
    (e) => {
      console.log(e)
    },
  )
}
