import Center from './Center'
import { Heading } from 'evergreen-ui'
import BtnAddCam from './BtnAddCam'

export default () => (
  <Center
    borderRadius="5px"
    backgroundColor="white"
    x={true}
    y={true}
    height="500px"
    flexDirection="column"
  >
    <Heading marginBottom="1em">Noch keine Kameras hinzugefügt</Heading>
    <BtnAddCam />
  </Center>
)
