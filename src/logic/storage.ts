import { useStorageLocal } from '~/composables/useStorageLocal'
import { useStorageIndexDB } from '~/composables/useStorageIndexDB'

export const storageDemo = useStorageLocal('webext-demo', 'Storage Demo')
export const storageWallpaperDB = useStorageIndexDB('wallpaper_db')
