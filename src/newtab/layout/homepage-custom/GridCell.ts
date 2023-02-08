export class GridCell {
  // configuration
  cfg: {
    id: number
    x: number
    y: number
    width: number
    height: number
    rotate: number
    scale: number
    isLocked: boolean // 是否锁定
    showMode: number
  }

  constructor() {
    this.cfg = {
      id: 0,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      rotate: 0,
      scale: 1,
      isLocked: false, // 是否锁定
      showMode: 0, // 0 格子 1 列表
    }
  }
}
