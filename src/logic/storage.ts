import { useStorageLocal } from '~/composables/useStorageLocal'
import { useStorageIndexDB } from '~/composables/useStorageIndexDB'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const storageWallpaperDB = useStorageIndexDB('wallpaper_db', '++id, blob, type')
export const storageWebsiteDB = useStorageIndexDB('website_db', '++id, webName,url, type,property') // 0 pined 1 most used
export const storageCustomLayoutDB = useStorageIndexDB('custom_layout_db', '&id, index, x, y, width, height,transform,isLocked, showMode, children') // 0 pined 1 most used
