import { Dialog } from 'evergreen-ui'
import { Button } from 'evergreen-ui/commonjs/buttons'

import Center from './Center'
import { eventTypeToString, normalizeEventType } from './EventTable'

export default ({ event, isShown, onClose = () => {} }) => (
  <Dialog
    isShown={isShown}
    title={`${eventTypeToString(event.type)} am ${new Date(
      parseInt(event.date),
    ).toLocaleString()}`}
    onCloseComplete={onClose}
    onConfirm={onClose}
    hasCancel={false}
    confirmLabel="Schließen"
  >
    {normalizeEventType(event.type) === 'CAMERA_ALARM' && (
      <>
        <video src={event.download} autoPlay muted controls width="100%" />
        <Center>
          <a href={event.download} download style={{ textDecoration: 'none' }}>
            <Button appearance="primary">Download</Button>
          </a>
        </Center>
      </>
    )}
    {normalizeEventType(event.type) === 'CAMERA_SHOT' && (
      <>
        <img src={event.download} width="100%" />
        <Center>
          <a
            href={event.download}
            download={`${new Date(parseInt(event.date)).toISOString()}.jpg`}
            style={{ textDecoration: 'none' }}
          >
            <Button appearance="primary">Download</Button>
          </a>
        </Center>
      </>
    )}
  </Dialog>
)
