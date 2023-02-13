import { storageCustomLayoutDB } from '~/logic'

export const getAllGridCell = async () => await storageCustomLayoutDB.getAllItem()
export const addAGridCell = async (params: {
  id: string
  index: number
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
    index: number
    x: number
    y: number
    width: number
    height: number
    isLocked: boolean // 是否锁定
    showMode: number
    transform: string
    children?: any
  },
) => await storageCustomLayoutDB.editItem(params)

export const getAllGridCellSortByIndex = async () => {
  return await storageCustomLayoutDB.getItemBySQL(
    { key: 'where', value: 'index' },
    { key: 'above', value: -1 },
    { key: 'sortBy', value: 'index' },
  )
}
