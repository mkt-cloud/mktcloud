import Center from './Center'
import { Spinner } from 'evergreen-ui'

const Loader = ({ height = '100%' }) => (
  <Center x y height={height}>
    <Spinner size={92} />
  </Center>
)

export default Loader
