// メモリベースの簡易データベース（本番環境用）
// 注意：サーバー再起動でデータが消えるため、開発/デモ用

interface MemoryUser {
  id: string
  email?: string | null
  name?: string | null
  image?: string | null
  firebaseUid?: string | null
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  notificationTime?: string | null
  timezone: string
  language: string
}

interface MemoryGoodDeedTemplate {
  id: string
  title: string
  description?: string | null
  category: string
  difficulty: string
  tags?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  usageCount: number
}

interface MemoryActivity {
  id: string
  userId: string
  templateId?: string | null
  customTitle?: string | null
  date: Date
  status: string
  note?: string | null
  mood?: string | null
  createdAt: Date
  updatedAt: Date
}

class MemoryDatabase {
  private users: Map<string, MemoryUser> = new Map()
  private templates: Map<string, MemoryGoodDeedTemplate> = new Map()
  private activities: Map<string, MemoryActivity> = new Map()
  private usersByFirebaseUid: Map<string, string> = new Map()
  
  constructor() {
    this.initializeTemplates()
  }
  
  private initializeTemplates() {
    const templates = [
      { id: '1', title: 'エレベーターのボタンを押してあげる', description: '誰かのために扉を開けて待つ', category: 'KINDNESS' },
      { id: '2', title: '道に落ちているゴミを拾う', description: '小さなゴミでも街をきれいに', category: 'ENVIRONMENT' },
      { id: '3', title: '誰かに「ありがとう」を伝える', description: '感謝の気持ちを言葉にする', category: 'KINDNESS' },
      { id: '4', title: '植物に水をあげる', description: '身近な緑を大切にする', category: 'ENVIRONMENT' },
      { id: '5', title: '席を譲る', description: '電車やバスで必要な人に', category: 'KINDNESS' },
      { id: '6', title: '募金をする', description: 'コンビニなどで小銭を', category: 'CHARITY' },
      { id: '7', title: '家族に電話する', description: '声を聞かせてあげる', category: 'FAMILY' },
      { id: '8', title: '同僚の仕事を手伝う', description: '忙しそうな人をサポート', category: 'WORK' },
      { id: '9', title: 'マイバッグを使う', description: 'レジ袋を断る', category: 'ENVIRONMENT' },
      { id: '10', title: '笑顔で挨拶する', description: '明るく元気に声をかける', category: 'KINDNESS' },
    ]
    
    templates.forEach(t => {
      this.templates.set(t.id, {
        ...t,
        description: t.description,
        difficulty: 'EASY',
        tags: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0
      })
    })
  }
  
  // User methods
  async findUserByFirebaseUid(firebaseUid: string): Promise<MemoryUser | null> {
    const userId = this.usersByFirebaseUid.get(firebaseUid)
    if (!userId) return null
    return this.users.get(userId) || null
  }
  
  async createUser(data: Partial<MemoryUser>): Promise<MemoryUser> {
    const user: MemoryUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email: data.email || null,
      name: data.name || null,
      image: data.image || null,
      firebaseUid: data.firebaseUid || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      notificationTime: null,
      timezone: 'Asia/Tokyo',
      language: 'ja',
      ...data
    }
    
    this.users.set(user.id, user)
    if (user.firebaseUid) {
      this.usersByFirebaseUid.set(user.firebaseUid, user.id)
    }
    
    return user
  }
  
  async updateUser(id: string, data: Partial<MemoryUser>): Promise<MemoryUser | null> {
    const user = this.users.get(id)
    if (!user) return null
    
    const updated = { ...user, ...data, updatedAt: new Date() }
    this.users.set(id, updated)
    
    if (updated.firebaseUid && updated.firebaseUid !== user.firebaseUid) {
      if (user.firebaseUid) {
        this.usersByFirebaseUid.delete(user.firebaseUid)
      }
      this.usersByFirebaseUid.set(updated.firebaseUid, id)
    }
    
    return updated
  }
  
  // Template methods
  async findTemplates(where?: any): Promise<MemoryGoodDeedTemplate[]> {
    const templates = Array.from(this.templates.values())
    
    if (where?.isActive !== undefined) {
      return templates.filter(t => t.isActive === where.isActive)
    }
    
    return templates
  }
  
  async findTemplateById(id: string): Promise<MemoryGoodDeedTemplate | null> {
    return this.templates.get(id) || null
  }
  
  // Activity methods
  async createActivity(data: Partial<MemoryActivity>): Promise<MemoryActivity> {
    const activity: MemoryActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: data.userId!,
      templateId: data.templateId || null,
      customTitle: data.customTitle || null,
      date: data.date || new Date(),
      status: data.status || 'COMPLETED',
      note: data.note || null,
      mood: data.mood || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    }
    
    this.activities.set(activity.id, activity)
    return activity
  }
  
  async findActivities(where: any): Promise<MemoryActivity[]> {
    const activities = Array.from(this.activities.values())
    
    return activities.filter(a => {
      if (where.userId && a.userId !== where.userId) return false
      
      if (where.date) {
        const activityDate = new Date(a.date)
        const searchDate = new Date(where.date.gte || where.date)
        
        activityDate.setHours(0, 0, 0, 0)
        searchDate.setHours(0, 0, 0, 0)
        
        if (where.date.gte && where.date.lte) {
          const endDate = new Date(where.date.lte)
          endDate.setHours(0, 0, 0, 0)
          return activityDate >= searchDate && activityDate <= endDate
        }
        
        return activityDate.getTime() === searchDate.getTime()
      }
      
      return true
    })
  }
  
  async findFirstActivity(where: any): Promise<MemoryActivity | null> {
    const activities = await this.findActivities(where)
    return activities[0] || null
  }
  
  async countActivities(where: any): Promise<number> {
    const activities = await this.findActivities(where)
    return activities.length
  }
  
  async getActivityWithTemplate(id: string) {
    const activity = this.activities.get(id)
    if (!activity) return null
    
    const template = activity.templateId ? this.templates.get(activity.templateId) : null
    
    return {
      ...activity,
      template
    }
  }
}

// グローバルインスタンス
const globalForMemoryDb = globalThis as unknown as {
  memoryDb: MemoryDatabase | undefined
}

export const memoryDb = globalForMemoryDb.memoryDb ?? new MemoryDatabase()

if (process.env.NODE_ENV !== 'production') {
  globalForMemoryDb.memoryDb = memoryDb
}