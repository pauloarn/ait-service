import { IsString } from 'class-validator'

export class NewAitDTO {
  @IsString()
  nome: string

  @IsString()
  nomeAgente: string

  @IsString()
  nomeCondutor: string

  @IsString()
  data: string
}

export interface NewAitInterface {
  nome: string
  nomeAgente: string
  nomeCondutor: string
  data: string
}
