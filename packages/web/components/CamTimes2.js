import { Alert, IconButton, Pane, Select, Text, TextInput } from 'evergreen-ui'
import React, { useState } from 'react'

import { bitToTime, timeSpanValid, timeToBit } from '../lib/timetable'
import Grid from './Grid'

const WEEK_DAYS = [
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
  'Sonntag',
]

const TimeInput = ({ value = 0, onChange = () => {}, isInvalid }) => {
  const [text, setText] = useState(bitToTime(value))
  const [error, setError] = useState(false)
  return (
    <TextInput
      value={text}
      width="100%"
      onChange={e => {
        const { value } = e.target
        const regex = /^(([01]?\d?|2?[0-3]?):?([0,3]?0?)|2?4?:?0?0?)$/g
        if (regex.test(value)) setText(value)
        const regexComplete = /^(([01]?\d|2[0-3]):([0,3]0)|24:00)$/g
        if (regexComplete.test(value)) setError(false)
      }}
      onBlur={() => {
        const regexComplete = /^(([01]?\d|2[0-3]):([0,3]0)|24:00)$/g
        if (regexComplete.test(text)) {
          setError(false)
          onChange(timeToBit(text))
        } else {
          setError(true)
        }
      }}
      isInvalid={isInvalid || error}
    />
  )
}

const BeginEndTimeFields = ({ beginValue, endValue, onChange }) => {
  const [{ begin, end }, setTime] = useState({
    begin: beginValue,
    end: endValue,
  })
  return (
    <>
      <TimeInput
        value={begin}
        onChange={newBegin => {
          setTime({ begin: newBegin, end })
          if (timeSpanValid(newBegin, end)) onChange({ begin: newBegin, end })
        }}
        isInvalid={!timeSpanValid(begin, end)}
      />
      <Pane display="flex" justifyContent="center" alignItems="center">
        <Text>-</Text>
      </Pane>
      <TimeInput
        value={end}
        onChange={newEnd => {
          setTime({ end: newEnd, begin })
          if (timeSpanValid(begin, newEnd)) onChange({ end: newEnd, begin })
        }}
        isInvalid={!timeSpanValid(begin, end)}
      />
    </>
  )
}

const NewField = ({ id, addNewField = () => {}, onRemove = () => {} }) => {
  const [newField, setNewField] = useState({ day: -1, begin: 0, end: 0 })
  const tryCommit = data => {
    const parsedDay = parseInt(data.day, 10)
    if (
      !isNaN(parsedDay) &&
      parsedDay >= 0 &&
      parsedDay < 7 &&
      timeSpanValid(data.begin, data.end)
    )
      addNewField(data, id)
  }
  return (
    <React.Fragment>
      <Select
        width="100%"
        value={newField.day}
        isInvalid={newField.day === -1}
        onChange={e => {
          setNewField({ ...newField, day: e.target.value })
          tryCommit({ ...newField, day: e.target.value })
        }}
      >
        <option key={-1} value={-1}>
          Bitte wählen
        </option>
        {WEEK_DAYS.map((d, i) => (
          <option key={i} value={i}>
            {d}
          </option>
        ))}
      </Select>
      <BeginEndTimeFields
        beginValue={newField.begin}
        endValue={newField.end}
        onChange={({ begin, end }) => {
          setNewField({ ...newField, begin, end })
          tryCommit({ ...newField, begin, end })
        }}
      />
      <IconButton
        appearance="minimal"
        icon="delete"
        onClick={() => {
          onRemove(id)
        }}
      />
    </React.Fragment>
  )
}

export default ({ values = [], onChange = () => {} }) => {
  const change = i => val => {
    const newArr = [...values]
    newArr.splice(i, 1, val)
    return onChange(newArr)
  }
  const addNewField = data => onChange([...values, data])
  const [showNewArr, setShowNewArr] = useState([])

  return (
    <Pane>
      <Alert
        intent="none"
        title="In diesen Zeiten wird der Alarm aktiviert"
        marginBottom=".5em"
      />
      <Grid gridTemplateColumns="6fr 5fr 1fr 5fr 1fr" gridGap=".5em">
        {values.map(({ day, begin, end }, i) => {
          const changeI = change(i)
          return (
            <React.Fragment key={`${day}-${begin}-${end}`}>
              <Select
                width="100%"
                value={day}
                onChange={e => changeI({ day: e.target.value, begin, end })}
              >
                {WEEK_DAYS.map((d, i) => (
                  <option key={i} value={i}>
                    {d}
                  </option>
                ))}
              </Select>
              <BeginEndTimeFields
                beginValue={begin}
                endValue={end}
                onChange={({ begin, end }) => changeI({ day, begin, end })}
              />
              <IconButton
                appearance="minimal"
                icon="delete"
                onClick={() => {
                  changeI({ day: 0, begin: 0, end: 0 })
                }}
              />
            </React.Fragment>
          )
        })}
        {showNewArr.map(i => (
          <NewField
            key={i}
            id={i}
            addNewField={(data, i) => {
              addNewField(data)
              setShowNewArr(showNewArr.filter(x => x !== i))
            }}
            onRemove={i => {
              setShowNewArr(showNewArr.filter(x => x !== i))
            }}
          />
        ))}
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Pane key={i} />
          ))}

        <IconButton
          appearance="minimal"
          icon="add"
          onClick={() => {
            const nextNumber = showNewArr.length
              ? showNewArr[showNewArr.length - 1] + 1
              : 0
            setShowNewArr([...showNewArr, nextNumber])
          }}
        />
      </Grid>
    </Pane>
  )
}
