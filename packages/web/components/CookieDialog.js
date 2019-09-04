import { Toggle } from 'react-powerplug'
import { CornerDialog } from 'evergreen-ui'

export default ({ show = true, onAccept = () => {} }) => (
  <Toggle initial={show} onChange={onAccept}>
    {({ on, toggle }) => (
      <CornerDialog
        title="Diese Seite nutzt Cookies"
        isShown={on}
        onCloseComplete={() => toggle()}
        hasCancel={false}
        confirmLabel="Ausblenden"
      >
        Mit dem nutzen dieser Website stimmen Sie der Verwendung von Cookies zu
        technischen Zwecken zu.
      </CornerDialog>
    )}
  </Toggle>
)
