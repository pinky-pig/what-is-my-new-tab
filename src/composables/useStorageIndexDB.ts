/* eslint-disable no-console */
import type { Table } from 'dexie'
import Dexie from 'dexie'

export interface WallPaperType {
  id: string
  data: string
}

export const useStorageIndexDB = (dataName: string) => {
  class MySubClassedDexie extends Dexie {
    common!: Table<WallPaperType>
    constructor() {
      super(dataName)
      this.version(1).stores({
        common: '++id, data',
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

    async getItemBySQL(...args: object[]) {
      console.log(args)
      return await db.common.where('age').below(25).toArray()
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
