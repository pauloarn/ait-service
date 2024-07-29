import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query
} from '@nestjs/common'
import { AitService } from '@modules/ait/ait.service'
import { Response } from '@typings/response.typing'
import { NewAitInterface } from '@modules/ait/dto/request/NewAit.dto'
import { AitSimpleDTO } from '@modules/ait/dto/response/AitSimple.dto'
import { AitStatusChangeDTO } from '@modules/ait/dto/request/AitStatusChange.dto'
import { Pagination } from 'nestjs-typeorm-paginate'
import { AitStatus } from '@typings/ati_status.typing'
import { Null } from '@typings/generic.typing'

@Controller('ait')
export class AitController {
  constructor(private aitService: AitService) {}

  @Get()
  async getAllAits(
    @Query('ait_status') ait_status: Null<AitStatus> = null,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10
  ): Promise<Response<Pagination<AitSimpleDTO>>> {
    const response: Response<Pagination<AitSimpleDTO>> = new Response()
    response.setData(await this.aitService.findAll({ limit, page }, ait_status))
    response.setOk()
    response.setStatusCode(HttpStatus.CREATED, 'REQUEST_DONE')
    return response
  }

  @Post('create')
  async createAit(
    @Body() body: NewAitInterface
  ): Promise<Response<AitSimpleDTO>> {
    const response: Response<AitSimpleDTO> = new Response()
    const createdAti = await this.aitService.createAit(body)
    response.setData(createdAti)
    response.setOk()
    return response
  }

  @Put('request-cancel/:aitId')
  async requestToCancelAit(
    @Param('aitId') aitId: string,
    @Body() body: AitStatusChangeDTO
  ): Promise<Response<AitSimpleDTO>> {
    const response: Response<AitSimpleDTO> = new Response<AitSimpleDTO>()
    const updatedAti = await this.aitService.requestCancelAit(
      aitId,
      body.motivo
    )
    response.setData(updatedAti)
    response.setOk()
    return response
  }

  @Put('confirm-ait-cancel/:aitId')
  async confirmCancelAit(
    @Param('aitId') aitId: string,
    @Body() body: AitStatusChangeDTO
  ) {
    const response: Response<AitSimpleDTO> = new Response<AitSimpleDTO>()
    const updatedAti = await this.aitService.confirmCancelAit(
      aitId,
      body.motivo
    )
    response.setData(updatedAti)
    response.setOk()
    return response
  }
}
