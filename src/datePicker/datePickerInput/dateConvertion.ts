/*
  Converts a Date object to a string in the format DD/MM/YYYY
*/
export function stringFromDate(date: Date | undefined): string {
  if (!date) return ''
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${day}/${month}/${year}`
}

/*
  Converts a string in the format DD/MM/YYYY to a Date object
*/
export function dateFromString(dateString: string): Date | null {
  const parts = dateString.split('/')
  if (parts.length !== 3) return null
  const [day, month, year] = parts.map(Number)
  return new Date(year as number, (month as number) - 1, day)
}
