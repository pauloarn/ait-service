import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SystemConfig } from '@config/system.config'
import { AppContextType, contextKeys, ContextUtil } from '@utils/context.util'
import { Undefined } from '../../typings/generic.typing'

@Injectable()
export class ContextService {
  private contextUtil = ContextUtil.getInstance()

  constructor(private configService: ConfigService) {}

  getConfig<T extends keyof SystemConfig>(key: T) {
    return this.configService.get<SystemConfig[T]>(key)
  }

  getDataContext<K extends keyof contextKeys>(
    key: K
  ): Undefined<contextKeys[K]> {
    return this.contextUtil.getContext(key)
  }

  setDataContext<K extends keyof contextKeys>(key: K, data: contextKeys[K]) {
    this.contextUtil.setContext(key, data)
  }

  changeContext(context: AppContextType, cb: () => void) {
    this.contextUtil.changeContext(context, cb)
  }
}
