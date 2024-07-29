import { CorsOptions } from 'cors'

const getCorsAllowList = (): string[] => {
  const allowedList: string[] = []
  const envAllowedList = process.env.CORS_ALLOW_LIST
  if (envAllowedList) {
    envAllowedList
      .split(',')
      .map((allowedItem) => allowedList.push(allowedItem))
  }
  return allowedList
}

export const systemConfig = () => {
  const env = process.env
  return {
    appName: env.npm_package_name,
    port: parseInt(env.PORT || '3031'),
    globalPrefix: env.CONTEXT_PATH,
    corsConfig: <CorsOptions>{
      origins: getCorsAllowList()
    }
  }
}

export type SystemConfig = ReturnType<typeof systemConfig>
