import propTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Button, Text } from 'evergreen-ui'
import Loader from './Loader'

const BraintreeWithoutSSR = dynamic(
  () => import('braintree-web-drop-in-react'),
  {
    ssr: false,
    loading: () => <Loader height="170px" />,
  },
)

export default class PaymentMethods extends React.Component {
  instance

  buy = async () => {
    const { onBuy } = this.props
    const { nonce } = await this.instance.requestPaymentMethod()
    return onBuy(nonce)
  }

  render() {
    const { clientToken, isSubmitting, update } = this.props
    return (
      <>
        <BraintreeWithoutSSR
          options={{
            authorization: clientToken,
            locale: 'de_DE',
            paypal: {
              flow: 'vault',
            },
          }}
          onInstance={instance => (this.instance = instance)}
        />
        <Button
          appearance="primary"
          type="button"
          width="100%"
          marginTop="1em"
          textAlign="center"
          onClick={this.buy}
          disabled={isSubmitting}
        >
          <Text textAlign="center" color="white" width="100%" fontWeight="700">
            {update ? 'Zahlungsart aktualisieren' : 'Abonnement abschließen'}
          </Text>
        </Button>
      </>
    )
  }
}

PaymentMethods.propTypes = {
  clientToken: propTypes.string.isRequired,
  onBuy: propTypes.func,
  isSubmitting: propTypes.bool,
  update: propTypes.bool,
}
PaymentMethods.defaultProps = {
  onBuy: () => {},
  isSubmitting: false,
}
