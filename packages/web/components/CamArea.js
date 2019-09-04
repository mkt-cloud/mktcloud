import React from 'react'
import { Pane } from 'evergreen-ui'
import Grid from './Grid'

const Field = ({ active, ...props }) => (
  <Pane
    cursor="pointer"
    backgroundColor={
      active ? 'rgba(250, 226, 226, .5)' : 'rgba(212, 238, 226, .5)'
    }
    {...props}
  />
)

const combineOldAndNewState = (area, gi, i) =>
  area.map(
    (x, i2) =>
      i2 === gi
        ? x
            .padStart(10, '0')
            .split('')
            .map((xx, i3) => (i3 === i ? (xx === '0' ? '1' : '0') : xx))
            .join('')
        : x,
  )

export default ({ area = [], onChange = () => {}, snap = '' }) => {
  return (
    <Pane position="relative">
      <img src={snap} width="100%" />
      <Grid
        gridTemplateRows="repeat(10, 1fr)"
        gridGap="1px"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={1}
      >
        {area.map((ar, gi) => (
          <React.Fragment key={gi}>
            <Grid gridTemplateColumns="repeat(10, 1fr)" gridGap="1px">
              {ar
                .padStart(10, '0')
                .split('')
                .map((bit, i) => (
                  <Field
                    key={`${gi}:${i}`}
                    active={bit === '1'}
                    onClick={() => onChange(combineOldAndNewState(area, gi, i))}
                  />
                ))}
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Pane>
  )
}
