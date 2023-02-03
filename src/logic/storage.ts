import { useStorageLocal } from '~/composables/useStorageLocal'
import { useStorageIndexDB } from '~/composables/useStorageIndexDB'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const storageWallpaperDB = useStorageIndexDB('wallpaper_db', '++id, blob, type')
export const storageWebsiteDB = useStorageIndexDB('website_db', '++id, webName,url, type') // 0 pined 1 most used
