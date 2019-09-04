import { Card } from 'evergreen-ui'
import PropTypes from 'prop-types'
import React from 'react'

import Grid from '../components/Grid'
import Page from '../components/Page'
import Cam from '../containers/Cam'
import CamAreaDialog from '../containers/CamAreaDialog'
import CamEvents from '../containers/CamEvents'
import CamPtz from '../containers/CamPtz'
import CamTimesDialog from '../containers/CamTimesDialog2'
import UpdateCameraForm from '../containers/UpdateCameraForm'
import checkLoggedIn from '../lib/checkLoggedIn'
import redirect from '../lib/redirect'

export default class CamsPage extends React.Component {
  static propTypes = {
    loggedInUser: PropTypes.any,
  }

  static async getInitialProps(context) {
    const { loggedInUser } = await checkLoggedIn(context.apolloClient)

    if (!loggedInUser.me) {
      // If not signed in, send them somewhere more useful
      redirect(context, '/signin')
    }

    const camId = context && context.query && context.query.id

    return { loggedInUser, camId }
  }

  state = {
    showAreaConf: false,
    showTimeConf: false,
    showMoveConf: false,
  }

  render() {
    const {
      camId,
      loggedInUser: {
        me: { plan },
      },
    } = this.props
    return (
      <Page activePage="cams" plan={plan}>
        <Cam
          id={camId}
          detail
          onAreaIconClick={() => this.setState({ showAreaConf: true })}
          onTimeIconClick={() => this.setState({ showTimeConf: true })}
          onMoveIconClick={() =>
            this.setState(s => ({ showMoveConf: !s.showMoveConf }))
          }
        />
        <CamTimesDialog
          id={camId}
          show={this.state.showTimeConf}
          toggle={() => this.setState({ showTimeConf: false })}
        />
        <CamAreaDialog
          id={camId}
          show={this.state.showAreaConf}
          toggle={() => this.setState({ showAreaConf: false })}
        />
        <CamPtz
          id={camId}
          show={this.state.showMoveConf}
          toggle={() => this.setState({ showMoveConf: false })}
        />
        <Grid marginY="1em" gridTemplateColumns="repeat(2, 1fr)" gridGap="1em">
          <Card backgroundColor="white" paddingY="1em">
            <UpdateCameraForm id={camId} />
          </Card>
          <CamEvents maxHeight="100%" id={camId} disableCamName />
        </Grid>
      </Page>
    )
  }
}
