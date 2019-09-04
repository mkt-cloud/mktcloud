import { Button } from 'evergreen-ui'
import Link from 'next/link'

const BtnAddCam = props => (
  <Link href="/add">
    <Button
      border="1px solid #1070ca !important"
      appearance="minimal"
      iconBefore="add"
      color="#1070ca !important"
      {...props}
    >
      Neue Kamera
    </Button>
  </Link>
)

export default BtnAddCam
