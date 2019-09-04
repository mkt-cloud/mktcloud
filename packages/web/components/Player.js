import { IconButton, Pane } from 'evergreen-ui'
import dynamic from 'next/dynamic'
import { Component } from 'react'

import Center from './Center'
import Loader from './Loader'

const Video = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => <Loader />,
})

export default class Player extends Component {
  state = {
    muted: true,
    playing: false,
  }

  componentDidMount() {
    this.props.autoPlay &&
      this.setState({
        muted: true,
        playing: true,
      })
  }

  render() {
    const { playing } = this.state
    const {
      minHeight,
      url,
      onTimeIconClick,
      onAreaIconClick,
      onMoveIconClick,
      onSettingsIconClick,
      onShotIconClick,
      canUsePtz,
      ...props
    } = this.props
    return (
      <Center backgroundColor="#000">
        <Pane maxWidth="1000px" minHeight={minHeight} position="relative">
          {url ? (
            <Video
              muted
              volume={1}
              playing={playing}
              width="100%"
              height="100%"
              url={url}
              {...props}
            />
          ) : (
            <Loader {...props} />
          )}
          <Center position="absolute" bottom={0} zIndex={1}>
            <Pane
              display="flex"
              backgroundColor="white"
              padding=".2em"
              borderTopLeftRadius="3px"
              borderTopRightRadius="3px"
              borderBottom="1px solid #E4E7EB"
              onClick={e => e.stopPropagation()}
            >
              {playing ? (
                <IconButton
                  appearance="minimal"
                  icon="pause"
                  title="Pause"
                  //marginRight=".2em"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.setState({ playing: false })
                  }}
                />
              ) : (
                <IconButton
                  appearance="minimal"
                  icon="play"
                  title="Start"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.setState({ playing: true })
                  }}
                />
              )}
              {onTimeIconClick && (
                <IconButton
                  appearance="minimal"
                  icon="time"
                  title="Überwachte Zeiten einstellen"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onTimeIconClick()
                  }}
                />
              )}
              {onAreaIconClick && (
                <IconButton
                  appearance="minimal"
                  icon="grid"
                  title="Überwachten Bereich einstellen"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onAreaIconClick()
                  }}
                />
              )}
              {onMoveIconClick &&
                canUsePtz && (
                  <IconButton
                    appearance="minimal"
                    icon="move"
                    title="Kamera bewegen"
                    onClick={e => {
                      e.preventDefault()
                      e.stopPropagation()
                      onMoveIconClick()
                    }}
                  />
                )}
              {onSettingsIconClick && (
                <IconButton
                  appearance="minimal"
                  icon="settings"
                  title="Einstellungen aufrufen"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onSettingsIconClick()
                  }}
                />
              )}
              {onShotIconClick && (
                <IconButton
                  appearance="minimal"
                  icon="camera"
                  title="Screenshot erstellen"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onShotIconClick()
                  }}
                />
              )}
            </Pane>
          </Center>
        </Pane>
      </Center>
    )
  }
}
