import { IsString } from 'class-validator'

export class AitStatusChangeDTO {
  @IsString()
  motivo: string
}
