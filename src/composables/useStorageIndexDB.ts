import type { Table } from 'dexie'
import Dexie from 'dexie'

export interface WallPaperType {
  id?: number
  blob: string
  type: number // 0 随机 1 自定义
}

export const useStorageIndexDB = (dataName: string) => {
  class MySubClassedDexie extends Dexie {
    common!: Table<WallPaperType>
    constructor() {
      super(dataName)
      this.version(1).stores({
        common: '++id, blob, type',
      })
    }
  }
  const db = new MySubClassedDexie()

  const storageIndexDB = {
    async addItem(value: WallPaperType) {
      await db.common.add(value)
    },

    async removeItem(key: number) {
      return await db.common.delete(key)
    },

    async editItem(value: WallPaperType) {
      return await db.common.put(value)
    },

    async getItem(key: number) {
      return await db.common.get(key)
    },
    /**
     * 查询一条语句
     * storageWallpaperDB.getItemBySQL(
     *  { key: 'where', value: 'type' },
     *  { key: 'equals', value: 1 },
     *  { key: 'toArray', value: null },
     * )
     * @param args 命令参数
     * @returns 查询结果
     */
    async getItemBySQL(...args: { key: string; value: string | number | null }[]) {
      let i = 0
      let m = args[0]
      let result = await (db.common as any)[m.key](m.value)
      while (i++ < (args.length - 1)) {
        m = args[i]
        result = await result[m.key](m.value)
      }
      return result
    },

    deleteStorageIndexDB() {
      db.delete()
    },

    closeStorageIndexDB() {
      db.close()
    },
  }

  return storageIndexDB
}
