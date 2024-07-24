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
  const isTest = env.NODE_ENV === 'test'
  const extension = isTest ? 'ts' : 'js'
  const extensionReact = isTest ? 'tsx' : 'js'

  const reactFileName = 'main'
  const reactCsvFileName = `${reactFileName}.csv.${extensionReact}`
  const reactPdfFileName = `${reactFileName}.pdf.${extensionReact}`
  const reportName = `report.${extension}`

  return {
    appName: env.npm_package_name,
    port: parseInt(env.PORT || '3031'),
    corsConfig: <CorsOptions>{
      origins: getCorsAllowList()
    },
    defaultFontName: 'Nunito',
    globalPrefix: env.CONTEXT_PATH || '/report',
    exportPdfInRootPath: env.EXPORT_PDF_IN_ROOT_PATH === 'true',
    exportBodyHtmlInRootPath: env.EXPORT_BODY_HTML_IN_ROOT_PATH === 'true',
    filename: {
      reactFileName,
      reactCsvFileName,
      reactPdfFileName,
      reportName
    }
  }
}

export type SystemConfig = ReturnType<typeof systemConfig>
