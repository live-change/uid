const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

function decodeCharacter(c) {
  if(c < 'A') return c.charCodeAt(0) - 48
  if(c < 'a') return c.charCodeAt(0) - 65 + 10
  return c.charCodeAt(0) - 97 + 36
}

function encodeNumber(number) {
  let out = ''
  let n = number
  do {
    out = characters[n % characters.length] + out
    n = (n / characters.length) | 0
  } while(n > 0)
  return out
}

function decodeNumber(str) {
  let out = 0
  let factor = 1
  for(let i = str.length - 1; i >= 0; i--) {
    out += decodeCharacter(str[i]) * factor
    factor *= characters.length
  }
  return out
}

function encodeDate(date = new Date()) {
  return '' +
    encodeNumber(date.getUTCFullYear()).padStart(2, '0') +
    characters[date.getUTCMonth() + 1] +
    characters[date.getUTCDate()] +
    characters[date.getUTCHours()] +
    characters[date.getUTCMinutes()] +
    characters[date.getUTCSeconds()] +
    characters[(date.getUTCMilliseconds() / 60)|0] +
    characters[date.getUTCMilliseconds() % 60]
}

function decodeDate(str = encodeDate(new Date)) {
  const date = new Date()
  date.setUTCFullYear(decodeNumber(str.slice(0, 2)))
  date.setUTCMonth(decodeCharacter(str[2]) - 1)
  date.setUTCDate(decodeCharacter(str[3]))
  date.setUTCHours(decodeCharacter(str[4]))
  date.setUTCMinutes(decodeCharacter(str[5]))
  date.setUTCSeconds(decodeCharacter(str[6]))
  date.setUTCMilliseconds(decodeCharacter(str[7]) * 60 + decodeCharacter(str[7]))
  return date
}

function randomString(length = 8) {
  let out = ''
  for(let i = 0; i < length; i++) {
    out += characters[(Math.random() * characters.length)|0]
  }
  return out
}

function hashCode(str) {
  let hash = 0
  if(this.length == 0) return hash
  for(let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash
}

function uidGenerator(fingerprint = randomString(4), numberLength = 0) {
  let lastMillisecond = Date.now(), lastId = 0
  function next() {
    const date = new Date()
    const now = date.getTime()
    if(now == lastMillisecond) {
      lastId ++
    } else {
      lastId = 0
      lastMillisecond = now
    }
    return '{' + encodeDate(date) + '.' + encodeNumber(lastId).padStart(numberLength, '0') + '@' + fingerprint + '}'
  }

  return next
}

function decodeUid(uid) {
  const dotIndex = uid.indexOf('.')
  const atIndex = uid.indexOf('@')
  const date = decodeDate(uid.slice(1, dotIndex))
  const number = decodeNumber(uid.slice(dotIndex + 1, atIndex))
  const at = uid.slice(atIndex + 1, -1)
  return { date, number, at }
}

function verifyUidSource(uid, source) {
  const { at } = decodeUid(uid)
  return at.slice(0, source.length) == source
}

module.exports = {
  encodeDate,
  decodeData,
  encodeNumber,
  hashCode,
  randomString,
  uidGenerator,
  decodeUid,
  verifyUidSource
}
