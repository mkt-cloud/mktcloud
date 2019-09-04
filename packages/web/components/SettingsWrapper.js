import { Card } from 'evergreen-ui'
import { SettingsMenu } from './SettingsMenu'

export function SettingsWrapper({ active, ...props }) {
  return (
    <Card
      marginTop="1em"
      width="100%"
      paddingX="2em"
      paddingY="1em"
      maxWidth="800px"
      display="grid"
      gridTemplateColumns="150px 1fr"
      gridGap="2em"
      backgroundColor="white"
    >
      <SettingsMenu
        showFirstDivider={false}
        showLogout={false}
        title="Profil"
        paddingY="1em"
        borderRight="1px solid #dfdfdf"
        active={active}
      />
      {props.children}
    </Card>
  )
}
