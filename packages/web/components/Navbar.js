import propTypes from 'prop-types'
import { Pane, Text } from 'evergreen-ui'
import BtnAddCam from './BtnAddCam'
import MyProfile from '../containers/MyProfile'
import Link from './Link'
import WidthFixxer from './WidthFixxer'

// NAVBAR
const Navbar = ({ navElements, ...props }) => (
  <Pane borderBottom="1px solid #dfdfdf !important" width="100%" {...props}>
    {
      //<Logo />
    }
    <WidthFixxer display="flex" alignItems="center" paddingY=".5em">
      <NavElements elements={navElements} flex={1} />
      <BtnAddCam marginRight="2em" />
      <MyProfile size={35} />
    </WidthFixxer>
  </Pane>
)

const navElementType = propTypes.shape({
  href: propTypes.string,
  active: propTypes.bool,
  id: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
})

Navbar.propTypes = {
  navElements: propTypes.arrayOf(navElementType),
}
Navbar.defaultProps = {
  navElements: [],
}

// NAV_ELEMENTS
const NavElements = ({ elements, ...props }) => (
  <Pane display="flex" paddingRight="2em" {...props}>
    {elements.map(elem => (
      <NavElement key={elem.id} marginRight="1em" element={elem} />
    ))}
  </Pane>
)

NavElements.propTypes = {
  elements: propTypes.arrayOf(navElementType),
}
NavElements.defaultProps = {
  elements: [],
}

// NAV_ELEMENT
const NavElement = ({ element: { href, value, active }, ...rest }) => (
  <Pane {...rest}>
    {href ? (
      <Link
        href={href}
        textDecoration="none"
        textTransform="uppercase"
        color={active ? 'blue' : 'neutral'}
      >
        {value}
      </Link>
    ) : (
      <Text textTransform="uppercase">{value}</Text>
    )}
  </Pane>
)

NavElement.propTypes = {
  element: navElementType.isRequired,
}

export default Navbar
