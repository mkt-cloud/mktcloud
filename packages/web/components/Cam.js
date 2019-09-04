import { Card, Heading, Pane, Paragraph } from 'evergreen-ui'

import Center from './Center'
import Player from './Player'

export default ({
  detail,
  hideDetail,
  title,
  url,
  model,
  id,
  canUsePtz,
  ...props
}) => {
  delete props.client // needs to be done to reduce rerenders, otherwise you get an stack overflow
  return (
    <Card
      elevation={detail ? 0 : 2}
      key={id}
      backgroundColor="white"
      overflow="hidden"
    >
      {!hideDetail &&
        (!detail ? (
          <Center
            x={true}
            y={true}
            height="60px"
            paddingY=".5em"
            flexDirection="column"
          >
            <Heading>{title}</Heading>
            <Paragraph>{model}</Paragraph>
          </Center>
        ) : (
          <Pane paddingLeft="3em">
            <Heading paddingTop=".8em" size={900}>
              {title}
            </Heading>
            <Paragraph paddingTop=".5em" paddingBottom="2.5em" size={500}>
              {model}
            </Paragraph>
          </Pane>
        ))}
      <Player autoPlay canUsePtz={canUsePtz} url={url} {...props} />
    </Card>
  )
}
