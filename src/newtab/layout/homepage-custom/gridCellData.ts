import { storageCustomLayoutDB } from '~/logic'

export const getAllGridCell = async () => await storageCustomLayoutDB.getAllItem()
export const addAGridCell = async (params: {
  id: string
  x: number
  y: number
  width: number
  height: number
  rotate: number
  scale: number
  isLocked: boolean // 是否锁定
  showMode: number
  children?: any
}) => await storageCustomLayoutDB.addItem(params)

export const deleteAGridCell = async (params: number) => await storageCustomLayoutDB.removeItem(params)
