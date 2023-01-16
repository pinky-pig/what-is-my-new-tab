/* eslint-disable no-console */
import type { Table } from 'dexie'
import Dexie from 'dexie'

export interface WallPaperType {
  id?: string
  blob: string
  type: number // 0 随机 1 自定义 2 渐变色
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

    async removeItem(key: string) {
      return await db.common.delete(key)
    },

    async editItem(value: WallPaperType) {
      return await db.common.put(value)
    },

    async getItem(key: string) {
      return await db.common.get(key)
    },

    async getItemBySQL(...args: { key: string; value: string | number | null }[]) {
      // const youngFriends = await db.common.where('type').equals(1).toArray()
      // alert (`My young friends: ${JSON.stringify(youngFriends)}`)
      console.log(args)

      const youngFriends = await (db.common as any)[args[0].key](args[0].value)[args[1].key](args[1].value)[args[2].key](args[2].value)
      alert (`My young friends: ${JSON.stringify(youngFriends)}`)
      return await db.common.where('type').equals(1).toArray()
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
