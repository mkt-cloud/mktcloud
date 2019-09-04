import { Menu, Pane, Heading } from 'evergreen-ui'
import Link from './Link'
import Logout from './Logout'

export function SettingsMenu({
  showFirstDivider = true,
  showLogout = true,
  title,
  active,
  ...props
}) {
  return (
    <Pane {...props}>
      {title && <Heading>{title}</Heading>}
      <Menu>
        {showFirstDivider && <Menu.Divider />}
        <Menu.Group>
          <Link
            color={active === 'settings' ? 'primary' : 'neutral'}
            textDecoration="none"
            href="/profile"
          >
            <Menu.Item>Einstellungen</Menu.Item>
          </Link>
          <Link
            color={active === 'abo' ? 'primary' : 'neutral'}
            textDecoration="none"
            href="/plan"
          >
            <Menu.Item>Abonnement</Menu.Item>
          </Link>
          <Link
            color={active === 'contact' ? 'primary' : 'neutral'}
            textDecoration="none"
            href="mailto:info@camcloud.eu"
          >
            <Menu.Item>Kontakt</Menu.Item>
          </Link>
        </Menu.Group>
        {showLogout && <Menu.Divider />}
        {showLogout && (
          <Menu.Group>
            <Menu.Item intent="danger">
              <Logout>Ausloggen</Logout>
            </Menu.Item>
          </Menu.Group>
        )}
      </Menu>
    </Pane>
  )
}
