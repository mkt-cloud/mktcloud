import { Pane, Text } from 'evergreen-ui'
import propTypes from 'prop-types'

import Navbar from './Navbar'
import WidthFixxer from './WidthFixxer'

const Page = ({ withNavbar, activePage, plan, ...props }) => (
  <>
    {plan === 'FREE' && (
      <a href="/plan" style={{ textDecoration: 'none' }}>
        <Pane
          width="100vw"
          height="32px"
          backgroundColor="#e67e22"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="white">
            Sie nutzen den FREE Plan. Sie können eine Kamera mit allen Features
            kostenlos nutzen.
          </Text>
        </Pane>
      </a>
    )}
    <Pane
      width="100vw"
      height={plan === 'FREE' ? 'calc(100vh - 32px)' : '100vh'}
    >
      {withNavbar && (
        <Navbar
          navElements={[
            {
              href: '/',
              id: 'dashboard',
              value: 'Übersicht',
            },
            {
              href: '/cams',
              id: 'cams',
              value: 'Kameras',
            },
          ].map(x => (x.id === activePage ? { ...x, active: true } : x))}
        />
      )}
      <Pane
        width="100%"
        height="calc(100% - 64px)"
        overflow="auto"
        paddingY="1em"
        background="#f5f5f5"
      >
        <WidthFixxer {...props} />
      </Pane>
    </Pane>
  </>
)

Page.propTypes = { withNavbar: propTypes.bool, activePage: propTypes.string }
Page.defaultProps = { withNavbar: true }

export default Page
