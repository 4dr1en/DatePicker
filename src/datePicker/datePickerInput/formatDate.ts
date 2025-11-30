/**
 * Format any random date string to DD/MM/YYYY format or partialy formatted date string to DD/MM/YYYY format
 */
export function formatDate(date: string): string {
  if (!date) {
    return ''
  }
  // Get only digits from the input string
  const digits = date.replace(/\D/g, '')

  let day = ''
  let month = ''
  let year = ''

  if (digits.length >= 2) {
    day = digits.substring(0, 2)
  } else {
    day = digits
  }

  if (digits.length >= 4) {
    month = digits.substring(2, 4)
  } else if (digits.length > 2) {
    month = digits.substring(2)
  }

  if (digits.length >= 5) {
    year = digits.substring(4, 8)
  }

  let formattedDate = day
  if ((day.length === 2 && digits.length > 2) || date.charAt(2) === '/') {
    formattedDate += '/'
  }
  formattedDate += month
  if ((month.length === 2 && digits.length > 4) || date.charAt(5) === '/') {
    formattedDate += '/'
  }
  formattedDate += year

  return formattedDate
}
