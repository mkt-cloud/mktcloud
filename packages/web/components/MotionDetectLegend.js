import { Pane, Text } from 'evergreen-ui'

export default () => (
  <Pane paddingY="1em">
    <Pane display="flex">
      <Pane
        marginRight=".5em"
        height="1em"
        width="1em"
        backgroundColor="#FAE2E2"
      />
      <Text>Aktiv</Text>
    </Pane>
    <Pane display="flex">
      <Pane
        marginRight=".5em"
        height="1em"
        width="1em"
        backgroundColor="#D4EEE2"
      />
      <Text>Inaktiv</Text>
    </Pane>
  </Pane>
)
