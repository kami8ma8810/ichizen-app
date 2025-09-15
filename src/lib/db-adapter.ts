// データベースアダプター
// 本番環境ではメモリDB、開発環境ではPrismaを使用

import { prisma } from './prisma'
import { memoryDb } from './memory-db'

const isProduction = process.env.NODE_ENV === 'production'
const useMemoryDb = isProduction && !process.env['DATABASE_URL']

export const db = {
  user: {
    findUnique: async (params: any) => {
      if (useMemoryDb) {
        if (params.where.firebaseUid) {
          return await memoryDb.findUserByFirebaseUid(params.where.firebaseUid)
        }
        return null
      }
      return prisma.user.findUnique(params)
    },
    
    create: async (params: any) => {
      if (useMemoryDb) {
        return await memoryDb.createUser(params.data)
      }
      return prisma.user.create(params)
    },
    
    update: async (params: any) => {
      if (useMemoryDb) {
        return await memoryDb.updateUser(params.where.id, params.data)
      }
      return prisma.user.update(params)
    }
  },
  
  goodDeedTemplate: {
    findMany: async (params?: any) => {
      if (useMemoryDb) {
        return await memoryDb.findTemplates(params?.where)
      }
      return prisma.goodDeedTemplate.findMany(params)
    },
    
    findUnique: async (params: any) => {
      if (useMemoryDb) {
        return await memoryDb.findTemplateById(params.where.id)
      }
      return prisma.goodDeedTemplate.findUnique(params)
    },
    
    count: async () => {
      if (useMemoryDb) {
        const templates = await memoryDb.findTemplates()
        return templates.length
      }
      return prisma.goodDeedTemplate.count()
    }
  },
  
  activity: {
    create: async (params: any) => {
      if (useMemoryDb) {
        return await memoryDb.createActivity(params.data)
      }
      return prisma.activity.create(params)
    },
    
    findMany: async (params: any) => {
      if (useMemoryDb) {
        const activities = await memoryDb.findActivities(params.where || {})
        
        // includeの処理
        if (params.include?.template) {
          return Promise.all(activities.map(async (a) => {
            const template = a.templateId ? await memoryDb.findTemplateById(a.templateId) : null
            return { ...a, template }
          }))
        }
        
        return activities
      }
      return prisma.activity.findMany(params)
    },
    
    findFirst: async (params: any) => {
      if (useMemoryDb) {
        return await memoryDb.findFirstActivity(params.where || {})
      }
      return prisma.activity.findFirst(params)
    },
    
    count: async (params: any) => {
      if (useMemoryDb) {
        return await memoryDb.countActivities(params.where || {})
      }
      return prisma.activity.count(params)
    }
  }
}