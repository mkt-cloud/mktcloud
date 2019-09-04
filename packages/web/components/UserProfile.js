import { SettingsMenu } from './SettingsMenu'
import propTypes from 'prop-types'
import { Pane, Avatar, Popover, Heading, Paragraph } from 'evergreen-ui'

const UserProfile = ({
  profile: { firstName, lastName, email, plan },
  ...props
}) => (
  <Pane>
    <Popover
      content={
        <Pane width={240} paddingX="1em" textAlign="center">
          <Pane paddingY="1em">
            <Paragraph size={300}>{plan}</Paragraph>
            <Heading>{`${firstName} ${lastName}`}</Heading>
            <Paragraph>{email}</Paragraph>
          </Pane>
          <SettingsMenu />
        </Pane>
      }
    >
      <Avatar
        cursor="pointer"
        isSolid
        name={`${firstName} ${lastName}`}
        {...props}
      />
    </Popover>
  </Pane>
)

UserProfile.propTypes = {
  profile: propTypes.shape({
    firstName: propTypes.string.isRequired,
    lastName: propTypes.string.isRequired,
    email: propTypes.string.isRequired,
    plan: propTypes.string.isRequired,
  }).isRequired,
}
UserProfile.defaultProps = {
  profile: {
    firstName: '',
    lastName: '',
    email: '',
    plan: '',
  },
}

export default UserProfile
