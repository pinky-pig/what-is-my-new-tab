import { storageCustomLayoutDB } from '~/logic'

export const getAllGridCell = async () => await storageCustomLayoutDB.getAllItem()
export const addAGridCell = async (params: {
  id: string
  x: number
  y: number
  width: number
  height: number
  isLocked: boolean // 是否锁定
  showMode: number
  transform: string
  children?: any
}) => await storageCustomLayoutDB.addItem(params)

export const deleteAGridCell = async (params: number) => await storageCustomLayoutDB.removeItem(params)
export const editAGridCell = async (
  params: {
    id: string
    x: number
    y: number
    width: number
    height: number
    isLocked: boolean // 是否锁定
    showMode: number
    transform: string
    index: number // indexDB递增主键字段
    children?: any
  },
) => await storageCustomLayoutDB.editItem(params)
