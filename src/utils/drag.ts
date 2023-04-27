import type { StyleValue } from 'vue'

export function dragInHorizontal(
  containerElement: HTMLElement,
  elements: HTMLElement[],
  size: number,
) {
  function bindEventListener() {
    containerElement.addEventListener('pointerdown', handlePointerdown)
    containerElement.addEventListener('pointermove', handlePointermove)
    containerElement.addEventListener('pointerup', handlePointerup)
  }
  function unbindEventListener() {
    containerElement.removeEventListener('pointerdown', handlePointerdown)
    containerElement.removeEventListener('pointermove', handlePointermove)
    containerElement.removeEventListener('pointerup', handlePointerup)
  }

  function handlePointerdown(e: PointerEvent) {
  }
  function handlePointermove(e: PointerEvent) {}
  function handlePointerup(e: PointerEvent) {}

  bindEventListener()

  function main() {

  }
  main()

  const getContainerStyle = computed(() => {
    return {
      position: 'relative',
    } as StyleValue
  })
  const getElementsStyle = computed((index) => {
    return {
      position: 'absolute',
      transform: `translate3d(${index * size}px, 0px, 0px)`,
    } as StyleValue
  })

  return {
    getContainerStyle,
    getElementsStyle,
    bindEventListener,
    unbindEventListener,
  }
}
