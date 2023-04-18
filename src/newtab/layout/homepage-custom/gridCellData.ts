import { storageCustomLayoutDB } from '~/logic'

export async function getAllGridCell() {
  return await storageCustomLayoutDB.getAllItem()
}
export async function addAGridCell(params: {
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
}) {
  return await storageCustomLayoutDB.addItem(params)
}

export async function deleteAGridCell(params: number) {
  return await storageCustomLayoutDB.removeItem(params)
}
export async function editAGridCell(params: {
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
}) {
  return await storageCustomLayoutDB.editItem(params)
}

export async function getAllGridCellSortByIndex() {
  return await storageCustomLayoutDB.getItemBySQL(
    { key: 'where', value: 'index' },
    { key: 'above', value: -1 },
    { key: 'sortBy', value: 'index' },
  )
}
