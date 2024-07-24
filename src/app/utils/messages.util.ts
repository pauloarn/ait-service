export const messagesUtil = {
  routeNotFound: 'Rota não encontrada',
  //= ===========================================================================================
  badRequest: 'Erro na requisição.',
  connectionDatabaseError: 'Erro na conexão com o banco',
  unknownError: 'Um erro desconhecido ocorreu',
  requestDone: 'Requisição concluída.',
  methodNotFound: 'Método não encontrado.',
  validationError: 'Error na validação',
  //= ===========================================================================================
  payloadTooLarge:
    'Payload da requisição ultrapassou o limite permitido pelo servidor'
}

export type messagesUtilKeys = keyof typeof messagesUtil
