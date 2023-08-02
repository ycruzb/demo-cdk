export type Page = {
  id: string
  url: string
  title: string
  wordCount: number
  crawledAt: number
}

export type AppSyncEvent = {
  info: {
    fieldName: string
  },
  arguments: {
    pageId: string
    url: string
    title: string
    wordCount: number
    crawledAt: number
    start: number
    end: number
    category: string
    page: Page
  },
  identity: {
    username: string
    claims: {
      [key: string]: string[]
    }
  }
}