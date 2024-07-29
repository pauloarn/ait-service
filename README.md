## Descrição

Aplicação voltada para o controle de AITs, fazendo seu cadastro, controle de status e comunicação da mesma com serviço
de mensageria.

Foi desenvolvida em NestJs com TypeORM, vizando se comunicar com um banco de dados PostgresSQL e o serviço de mensageria
RabbitMQ.

O projeto contém um arquivo docker-compose.yml com as configurações dos containers que serão necessários para utilizar a
aplicação.

## Requerimentos para utilizar o projeto

1. NodeJs instalado
2. Docker instalado
3.

## Instalção

1. Inicialmente precisamos criar e rodar os containers do docker.

```bash
 $ docker compose up
```

2. Após criar e subir os container é necessário instalar as dependencias do projeto

```bash
$ npm install
```

## Rodando a aplicação

1. Após instaladas o projeto pode ser iniciado, ele se encarregará de criar as tabelas e a fila de mensagens.

```
$ npm run start
```

A aplicação irá iniciar na porta 3031, então para acessala é necessário fazer as requisições
para `http://localhost:3031`

2. A aplicação se constitui de 4 rotas
    - Rota para listagem de AITs (`GET '/ait'`):
      Rota utilizada para listar todas as AITs de forma paginada. Recebe query params para controlar a paginação e
      filtrar as AITs por
      status:
        - Parametros: page (define qual página a carregar), limit(define a quantidade de itens por página), status (
          filtra as AITs pelo status especificado, status: 'EM_ANDAMENTO', 'SOLICITADO_CANCELAMENTO', 'CANCELADO')

    - Rota para criar AIT (`POST '/ait'`):
      Rota utilizada para criar uma nova AIT, recebe como body um objeto com as informações da AIT:
      ```json
      {
        "nome":"Nome da AIT",
        "nomeAgente": "Nome do Agente",
        "nomeCondutor": "Nome do Contudor",
        "data": "2024-07-25"
      }
      ```
      Obs: Data informada deve estar no formato ``aaaa-mm-dd``

    - Retorna um body com as informações da AIT criada
      ```json
      {
        "statusCode": 200,
        "body": {
          "id": "f6ad9eec-5da8-486b-8359-2e82736b48ed",
          "nome":"Nome da AIT",
          "nomeAgente": "Nome do Agente",
          "nomeCondutor": "Nome do Contudor",
          "data": "2024-07-25"
          "status": "EM_ANDAMENTO"
        },
        "messageCode": "REQUEST_DONE",
        "message": "Requisição concluída."
      }

    - Rota para solicitar cancelamento da AIT (`PUT '/ait/request-cancel/:ait_id'`):
      Rota para movimentar a AIT para 'SOLICITADO_CANCELAMENTO', necessário informar o ID da ATI sendo alterada url da
      requisição e informar o motivo da alteração no body da requisição
      ex:
      ``rota: /ait/request-cancel/f6ad9eec-5da8-486b-8359-2e82736b48ed``
      ```json
      "body":{
          "motivo" : "Motivo para solicitar cancelamento da AIT"
      }
      ```
      Retorna o mesmo objeto da criação da AIT porém agora com a AIT atualizada para o novo status

    - Rota para confirmar cancelamento da AIT (`PUT '/ait/confirm-ait-cancel/:ait_id'`):
      Rota para movimentar a AIT para 'CANCELADO', necessário informar o ID da AIT sendo alterada pela url da requisição
      e informar o motivo do cancelamento no body da requisição, ex:
      ex:
      ``rota: /ait/request-cancel/f6ad9eec-5da8-486b-8359-2e82736b48ed``
      ```json
      "body":{
          "motivo" : "Motivo para cancelar AIT"
      }
      ```  
            