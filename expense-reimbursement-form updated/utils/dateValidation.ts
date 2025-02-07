export function isDateWithin30Days(dateString: string): boolean {
  const billDate = new Date(dateString)
  const currentDate = new Date()
  const differenceInTime = currentDate.getTime() - billDate.getTime()
  const differenceInDays = differenceInTime / (1000 * 3600 * 24)
  return differenceInDays <= 30
}

