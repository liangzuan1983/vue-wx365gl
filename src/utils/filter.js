// 保留小数
const formatNum = (num, n = '') => {
  let value = Number(num)
  if (n) {
    let square = Math.pow(10, n)
    return Math.round(value * square) / square
  } else {
    return Math.round(value * 100) / 100
  }
}

// 保留小数
const formatInteger = (num) => {
  if (!num) {
    return 0
  }
  let value = Number(num)
  return Math.round(value)
}

// 百分比
const formatPercent = (num, n = '') => {
  let value = Number(num) || 0
  if (n) {
    let square = Math.pow(10, n)
    return Math.round(value * square) / (square - 2) + '%'
  } else {
    return Math.round(value * 100) + '%'
  }
}

// 格式化时间
const formatDate = (str, pattern = '') => {
  if (!str) { return '' }
  let value = new Date(str)
  let year = value.getFullYear()
  let month = value.getMonth() + 1 + ''
  month = month.padStart(2, '0')
  let day = value.getDate() + ''
  day = day.padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${year}-${month}-${day}`
  }
  let hour = value.getHours() + ''
  hour = hour.padStart(2, '0')
  let minutes = value.getMinutes() + ''
  minutes = minutes.padStart(2, '0')
  let seconds = value.getSeconds() + ''
  seconds = seconds.padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}

// 解码
const symbolParse = content => {
  return content.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, '\'')
}

export {formatNum, formatInteger, formatPercent, formatDate, symbolParse}
