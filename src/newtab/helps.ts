export const yearProgress = ref(0)
export const monthProgress = ref(0)
export const dayProgress = ref(0)
export const hourProgress = ref(0)
export const minProgress = ref(0)

main()

setInterval(() => {
  main()
}, 1000 * 60)

function main() {
  const [now, yElapsed] = calculatesSecondsFromStartOfYear()
  yearProgress.value = calculateYearProgress(now as Date, yElapsed as number)
  monthProgress.value = calculateMonthProgress(now as Date)
  dayProgress.value = calculateDayProgress(now as Date)
  hourProgress.value = calculateHourProgress(now as Date)
  minProgress.value = calculateMinProgress(now as Date)
}

function calculatesSecondsFromStartOfYear() {
  const d = new Date()
  d.setMonth(0)
  d.setDate(1)
  d.setHours(0)
  d.setMinutes(0)
  d.setSeconds(0)

  const now = new Date()
  const yElapsed = now.getTime() - d.getTime()
  return [now, yElapsed]
}

function calculateYearProgress(now: Date, yElapsed: number) {
  const spy = secondsInYear(now.getFullYear())
  let yPerc = yElapsed / 1000 / spy
  yPerc = Math.round(yPerc * 10000000) / 100000
  return yPerc
}

function calculateMonthProgress(now: Date) {
  const currentMonth = new Date()
  currentMonth.setDate(1)
  currentMonth.setHours(0)
  currentMonth.setMinutes(0)
  currentMonth.setSeconds(0)
  currentMonth.setMilliseconds(0)

  const mElapsed = now.getTime() - currentMonth.getTime()
  const spm = secondsInMonth(now.getFullYear(), now.getMonth() + 1)
  let mperc = mElapsed / 1000 / spm
  mperc = Math.round(mperc * 1000000) / 10000

  return mperc
}

function calculateDayProgress(now: Date) {
  const currentDay = new Date()
  currentDay.setHours(0)
  currentDay.setMinutes(0)
  currentDay.setSeconds(0)
  currentDay.setMilliseconds(0)
  const dElapsed = now.getTime() - currentDay.getTime()
  let dperc = dElapsed / 1000 / 86400
  dperc = Math.round(dperc * 1000000) / 10000

  return dperc
}

function calculateHourProgress(now: Date) {
  const currentHr = new Date()
  currentHr.setMinutes(0)
  currentHr.setSeconds(0)
  currentHr.setMilliseconds(0)
  const hElapsed = now.getTime() - currentHr.getTime()
  let hperc = hElapsed / 1000 / 3600
  hperc = Math.round(hperc * 1000000) / 10000
  return hperc
}

function calculateMinProgress(now: Date) {
  const currentMin = new Date()
  currentMin.setSeconds(0)
  currentMin.setMilliseconds(0)
  const minElapsed = now.getTime() - currentMin.getTime()
  let minperc = minElapsed / 1000 / 60
  minperc = Math.round(minperc * 1000000) / 10000

  return minperc
}

/**
 * 1.计算是不是在二月
 * @param year 今年 new Date().getFullYear()
 * @returns 总共有多少时间（是否闰年）
 */
function secondsInYear(year: number): number {
  if (leapYear(year))
    return 31622400
  else
    return 31536000
}

/**
 * 2.是否闰年
 * @param year 今年new Date().getFullYear()
 * @returns 是否
 */
function leapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * 3.这个月共有多少秒
 * @param year 年
 * @param month 月
 * @returns 时间
 */
function secondsInMonth(year: number, month: number): number {
  const sim = new Date(year, month, 0).getDate() * 24 * 3600
  return sim
}
