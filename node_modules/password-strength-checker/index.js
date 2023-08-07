#!/usr/bin/env node

'use strict'

const prompt = require('prompt')
const zxcvbn = require('zxcvbn')
const clc = require('cli-color')
const debug = require('debug')('pwd')

const STRENGTH_BAR_LENGTH = 10
const MAX_PASSWORD_STRENGTH = 5

prompt.start()

prompt.get({
  properties: {
    password: {
      message: 'Please input your password',
      require: true,
      hidden: true
    }
  }
}, (err, result) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  const pwd = result.password
  const output = showResult(zxcvbn(pwd))
  debug(zxcvbn(pwd))
  console.log(output.join('\n'))
})

function drawStrength (val, maxVal) {
  let currRatio = ((val / maxVal) > 0) ? (val / maxVal) : false
  let drawResult = []
  drawResult.push('[')

  if (drawResult) {
    let barVal = Math.round(currRatio * STRENGTH_BAR_LENGTH)
    for (let x = 0; x < STRENGTH_BAR_LENGTH; x++) {
      let drawChar = (x < barVal) ? clc.green('|') : clc.white('-')
      drawResult.push(drawChar)
    }
  }
  drawResult.push(']')

  return drawResult.join('')
}

function showResult (data) {
  let result = []

  result.push(`Your password strength: ${data.score}: ${drawStrength(data.score, MAX_PASSWORD_STRENGTH)}`)
  result.push(`It might be guess in ${data.guesses} time`)

  if (data.crack_times_display) {
    let crackTimes = data.crack_times_display
    let crackTimesKey = Object.keys(crackTimes)

    for (let x = 0; x < crackTimesKey.length; x++) {
      result.push(`${crackTimesKey[x]} - ${crackTimes[crackTimesKey[x]]}`)
    }
  }

  return result
}
