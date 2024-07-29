export const messagesUtil = {
  ROUTE_NOT_FOUND: 'Rota não encontrada',
  //= ===========================================================================================
  BAD_REQUEST: 'Erro na requisição.',
  CONNECTION_DATA_BASE_ERROR: 'Erro na conexão com o banco',
  UNKNOWN_ERROR: 'Um erro desconhecido ocorreu',
  REQUEST_DONE: 'Requisição concluída.',
  METHOD_NOT_FOUND: 'Método não encontrado.',
  AIT_NOT_FOUND: 'AIT não encontrada',
  NEED_REASON: 'Necessário informar motivo para movimentação da AIT',
  AIT_NOT_ON_GOING: 'AIT não está em andamento',
  AIT_ALREADY_CANCELED: 'AIT já cancelada',
  AIT_NOT_REQUESTED_TO_CANCEL: 'AIT não foi solicitada para cancelamento',
  AIT_ALREADY_REQUESTED_TO_CANCEL:
    'AIT já aguardando confirmação de cancelamento',
  VALIDATION_ERRO: 'Error na validação',
  //= ===========================================================================================
  PAYLOAD_TOO_LARGE:
    'Payload da requisição ultrapassou o limite permitido pelo servidor'
}

export type MessagesUtilKeys = keyof typeof messagesUtil
