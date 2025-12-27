/**
 * Converts a Date object to a string in the given format
 * @param date The Date object to format
 * @param format The format string (e.g. 'DD/MM/YYYY', 'MM-DD-YYYY')
 * @returns The formatted date string
 */
export function formatDate(date: Date, format: string): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return format.replace('DD', day).replace('MM', month).replace('YYYY', year.toString())
}

/**
 * Parses a date string in the given format to a Date object
 * @param dateString The date string to parse
 * @param format The format string (e.g. 'DD/MM/YYYY', 'MM-DD-YYYY')
 * @returns The parsed Date object or null if parsing fails
 */
export function parseDate(dateString: string, format: string): Date | null {
  const dayPos = format.indexOf('DD')
  const monthPos = format.indexOf('MM')
  const yearPos = format.indexOf('YYYY')

  if (dayPos === -1 || monthPos === -1 || yearPos === -1) throw new Error('Invalid format string')

  const day = Number(dateString.slice(dayPos, dayPos + 2))
  const month = Number(dateString.slice(monthPos, monthPos + 2))
  const year = Number(dateString.slice(yearPos, yearPos + 4))

  if (isNaN(day) || isNaN(month) || isNaN(year)) throw new Error('Invalid date components')

  return new Date(year, month - 1, day)
}