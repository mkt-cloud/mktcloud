import propTypes from 'prop-types'
import { Pane } from 'evergreen-ui'

const Center = ({ x = true, y = false, ...props }) => (
  <Pane
    display="flex"
    {...(y ? { alignItems: 'center', height: '100%' } : {})}
    {...(x ? { justifyContent: 'center', width: '100%' } : {})}
    {...props}
  />
)

Center.propTypes = {
  x: propTypes.bool,
  y: propTypes.bool,
}

export default Center
