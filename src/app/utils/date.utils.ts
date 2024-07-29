export const returnDateFromStringFormated = (data: string) => {
  const separator = `-`

  if (data.length === 10) {
    const dia = Number(data.split(separator)[2])
    const mes = Number(data.split(separator)[1])
    const ano = Number(data.split(separator)[0])

    if (dia > 31) {
      throw new Error('Dia Inválido')
    }
    if (mes > 12) {
      throw new Error('Mês Inválido')
    }
    if (mes === 2 && dia > 29) {
      throw new Error('Dia inválido')
    }
    return new Date(Number(ano), Number(mes) - 1, Number(dia))
  }
  throw new Error('Necessário informar data no formato aaaa-mm-dd')
}

export const getDateStringFromDateObject = (date: Date) => {
  const tempDate = new Date(date)
  const month = (tempDate.getMonth() + 1).toString().padStart(2, '0')
  const day = tempDate.getDate().toString().padStart(2, '0')
  return `${tempDate.getFullYear()}-${month}-${day}`
}
