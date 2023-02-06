import { storageWebsiteDB } from '~/logic'

export const getPinedWebsite = async () => {
  const queryResult = await storageWebsiteDB.getItemBySQL(
    { key: 'where', value: 'type' },
    { key: 'equals', value: 0 },
    { key: 'toArray', value: null },
  )

  return queryResult
}
export const addPinedWebsite = async (params: { url: string; type: number; webName: string; property: { color: string } }) => await storageWebsiteDB.addItem(params)
export const deletePinedWebsite = async (params: number) => await storageWebsiteDB.removeItem(params)
export const editPinedWebsite = async (params: { id: number; url: string; type: number; webName: string; property: { color: string } }) => await storageWebsiteDB.editItem(params)
