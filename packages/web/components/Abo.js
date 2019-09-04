import { Button, Heading, Pane, Position, Text, toaster } from 'evergreen-ui'
import { Field, Form, withFormik } from 'formik'

import PaymentMethods from '../containers/PaymentMethods'
import { SelectMenuField } from './formik-evergreen'

const options = [
  { label: 'Kostenlos', value: 'FREE' },
  { label: 'Premium', value: 'PREMIUM' },
]

const Abo = ({
  noPaymentMethod,
  isSubmitting,
  dirty,
  handleSubmit,
  handleChange,
  plan,
  cameraCount,
  values: { plan: currentPlan },
}) => (
  <Pane>
    <Form>
      <Pane display="flex" alignItems="flex-end">
        <Pane flex="1">
          <Field
            name="plan"
            label="Aktueller Plan"
            disabled={noPaymentMethod}
            options={options}
            hasFilter={false}
            description={
              currentPlan === 'FREE'
                ? `Hier können Sie ihren aktuellen Plan ändern.${
                    noPaymentMethod
                      ? ' Um auf Premium zu wechseln benötigen Sie eine Zahlungsmethode.'
                      : ''
                  }`
                : `Ihre monatlichen Kosten belaufen sich auf ${(
                    Math.max(cameraCount - 1, 1) * 2.5
                  ).toLocaleString('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                  })} für ${Math.max(cameraCount, 2)} Kameras`
            }
            component={SelectMenuField}
            position={Position.BOTTOM}
            height={66}
          >
            <Button type="button" width="100%">
              {options.find(x => x.value === currentPlan).label}
            </Button>
          </Field>
        </Pane>
        {dirty &&
          currentPlan === 'FREE' && (
            <Button
              type="submit"
              appearance="primary"
              disabled={isSubmitting || !dirty}
              marginLeft="1em"
            >
              Speichern
            </Button>
          )}
      </Pane>

      {currentPlan !== 'FREE' && <Text />}
    </Form>
    {currentPlan !== 'FREE' && (
      <>
        <Heading marginTop="1em" marginBottom="2em">
          Zahlungsmethoden
        </Heading>
        <PaymentMethods
          update={plan !== 'FREE'}
          isSubmitting={isSubmitting}
          onBuy={nonce => {
            handleChange({ target: { name: 'nonce', value: nonce } })
            handleSubmit()
          }}
        />
      </>
    )}
  </Pane>
)

export default withFormik({
  mapPropsToValues: ({ plan }) => ({ plan: plan || 'FREE', nonce: '' }),
  enableReinitialize: true,
  handleSubmit: async (values, { props: { updatePlan }, setSubmitting }) => {
    await updatePlan({
      variables: values,
    })
    toaster.success('Plan wurde erfolgreich geupdated!')
    setSubmitting(false)
  },
})(Abo)
