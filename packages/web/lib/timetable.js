export const bitsToForm = (arr = []) => {
  const regex = /([0|1])\1*/g
  const createObj = arr => {
    let count = 0
    return arr
      .map(str => {
        const countAtStart = count
        count = count + str.length
        if (str.substr(0, 1) === '0') {
          return false
        } else {
          return { begin: countAtStart, end: count }
        }
      })
      .filter(x => !!x)
  }
  let day = -1
  return arr
    .map(dayStr => {
      const dayArr = dayStr.match(regex)
      const dayObj = createObj(dayArr)
      day++
      return dayObj.map(x => ({
        day,
        ...x,
      }))
    })
    .reduce((acc, val) => [...acc, ...val], [])
}

export const groupFormByDay = formValues =>
  formValues.reduce(
    (acc, { day, begin, end }) => ({
      ...acc,
      [day]: [...(acc[day] || []), { begin, end }],
    }),
    Array(7)
      .fill(0)
      .map((_, i) => i)
      .reduce((acc, val) => ({ ...acc, [val]: [] }), {}),
  )

export const ungroupFormByDay = groupedFormValues => {
  const result = []
  for (const day in groupedFormValues) {
    if (groupedFormValues.hasOwnProperty(day)) {
      const value = groupedFormValues[day]
      result.push(...value.map(x => ({ day: parseInt(day, 10), ...x })))
    }
  }
  return result
}

export const timeSpanValid = (x, y) => x < y
export const formToBits = formValues => {
  const byDay = groupFormByDay(formValues)

  const result = []
  for (const prop in byDay) {
    const parsedProp = parseInt(prop, 10)
    if (!isNaN(parsedProp) && parsedProp >= 0 && parsedProp < 7) {
      const value = byDay[prop]
      const arr = Array(48).fill(0)
      value
        .filter(({ begin, end }) => timeSpanValid(begin, end))
        .forEach(({ begin, end }) => {
          arr.splice(begin, end - begin, ...Array(end - begin).fill(1))
        })
      result.push(arr.join(''))
    }
  }
  return result
}

export const pad = (length, filler = 0) => val =>
  `${
    length - val.toString().length > 0
      ? Array(length - val.toString().length)
          .fill(filler)
          .join('')
      : ''
  }${val}`

export const bitToTime = (num = 0) => {
  const timeInMin = num * 30
  const hours = Math.floor(timeInMin / 60)
  const mins = timeInMin % 60
  const pad2 = pad(2)

  return `${pad2(hours)}:${pad2(mins)}`
}

export const timeToBit = (time = '') => {
  const [hours, mins] = time.split(':').map(x => parseInt(x, 10))
  return (hours * 60 + mins) / 30
}
