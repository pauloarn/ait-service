import { v4 as uuidV4 } from 'uuid'
import { createNamespace, Namespace } from 'cls-hooked'
import { NextFunction } from 'express'
import { Undefined } from '../../typings/generic.typing'

const context = ['api', 'scheduler'] as const

export type AppContextType = (typeof context)[number]

export interface contextKeys {
  req: {
    method: string
    host: string
    originalUrl: string
  }
  logger: {
    transactionId: string
    context: AppContextType
  }
}

export class ContextUtil {
  private static instance: ContextUtil
  private ns: Namespace

  private constructor() {
    this.ns = createNamespace(uuidV4())
  }

  static getInstance() {
    if (!ContextUtil.instance) {
      ContextUtil.instance = new ContextUtil()
    }
    return ContextUtil.instance
  }

  changeContext(namespace: AppContextType, cb: () => void) {
    this.ns.run(() => {
      this.setContext('logger', {
        context: namespace,
        transactionId: uuidV4()
      })
      cb()
    })
  }

  setContext<K extends keyof contextKeys>(key: K, data: contextKeys[K]) {
    if (this.existContext()) this.ns.set(key, data)
  }

  getContext<K extends keyof contextKeys>(key: K): Undefined<contextKeys[K]> {
    if (this.existContext()) return this.ns.get(key)
  }

  private existContext() {
    return this.ns && this.ns.active
  }

  static middleware(req: Request, res: Response, next: NextFunction) {
    const context = ContextUtil.getInstance()
    context.changeContext('api', () => next())
  }
}
