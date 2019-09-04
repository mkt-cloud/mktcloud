import { Pane, Text, Tooltip } from 'evergreen-ui'
import React from 'react'

import Grid from './Grid'

const WEEK_DAYS = {
  0: 'Montag',
  1: 'Dienstag',
  2: 'Mittwoch',
  3: 'Donnerstag',
  4: 'Freitag',
  5: 'Samstag',
  6: 'Sonntag',
}

const Field = ({ active, tooltip = '', ...props }) => (
  <Tooltip hideDelay={50} content={tooltip} position={Position.TOP}>
    <Pane
      cursor="pointer"
      backgroundColor={active ? '#FAE2E2' : '#D4EEE2'}
      width="100%"
      height="100%"
      {...props}
    />
  </Tooltip>
)

const getTimeFromIndex = i =>
  `${parseInt((30 * i) / 60)
    .toString()
    .padStart(2, '0')}:${((30 * i) % 60).toString().padStart(2, '0')}`

const combineOldAndNewState = (schedules, gi, i) =>
  schedules.map(
    (x, i2) =>
      i2 === gi
        ? x
            .padStart(48, '0')
            .split('')
            .map((xx, i3) => (i3 === i ? (xx === '0' ? '1' : '0') : xx))
            .join('')
        : x,
  )

export default ({
  schedules = [],
  unshiftSchedule = () => {},
  onChange = () => {},
}) => {
  return (
    <Grid
      gridTemplateRows="repeat(7, 1fr)"
      gridTemplateColumns="1fr 5fr"
      gridGap="1px"
    >
      {schedules.map((schedule, gi) => (
        <React.Fragment key={gi}>
          <Text>{WEEK_DAYS[gi]}</Text>
          <Grid gridTemplateColumns="repeat(48, 1fr)" gridGap="1px">
            {schedule
              .padStart(48, '0')
              .split('')
              .map((bit, i) => (
                <Field
                  key={`${gi}:${i}`}
                  tooltip={getTimeFromIndex(i)}
                  active={bit === '1'}
                  onMouseDown={() =>
                    onChange(
                      unshiftSchedule(combineOldAndNewState(schedules, gi, i)),
                    )
                  }
                />
              ))}
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  )
}
