import { storageWebsiteDB } from '~/logic'

export interface WebsiteParams {
  id?: number
  url: string
  type: number
  webName: string
  icon: string
  index: number
  property: { color: string }
}
export async function getPinedWebsite() {
  const queryResult = await storageWebsiteDB.getItemBySQL(
    { key: 'where', value: 'type' },
    { key: 'equals', value: 0 },
    { key: 'toArray', value: null },
  )

  return queryResult
}
export async function addPinedWebsite(params: WebsiteParams) {
  return await storageWebsiteDB.addItem(params)
}
export async function deletePinedWebsite(params: number) {
  return await storageWebsiteDB.removeItem(params)
}
export async function editPinedWebsite(params: WebsiteParams) {
  return await storageWebsiteDB.editItem(params)
}
