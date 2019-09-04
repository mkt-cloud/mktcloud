import { Dialog, toaster } from 'evergreen-ui'
import { Form, Field, withFormik } from 'formik'
import { validations } from '@camcloud/common'
import * as yup from 'yup'

import { TextInputField } from './formik-evergreen'

const ResetPasswordDialog = ({
  isShown,
  blockInput,
  isSubmitting,
  handleSubmit,
}) => (
  <Dialog
    isShown={isShown}
    title="Password zurücksetzen"
    isConfirmLoading={isSubmitting}
    onConfirm={handleSubmit}
    confirmLabel={isSubmitting ? 'Senden...' : 'eMail senden'}
    cancelLabel="Abbrechen"
    intent="danger"
  >
    <Form>
      <Field
        name="email"
        placeholder="eMail Adresse"
        label="eMail Adresse"
        disabled={blockInput}
        description="Ihnen wird eine eMail gesendet in welcher sich ein Link zum Ändern des Passwortes befindet. Bitte vergewissern Sie sich dass Sie Zugriff auf Ihr eMail Postfach haben."
        component={TextInputField}
      />
    </Form>
  </Dialog>
)

export default withFormik({
  mapPropsToValues: ({ email }) => ({ email: email || '' }),
  validationSchema: yup.object().shape({
    email: validations.emailValidation,
  }),
  enableReinitialize: true,
  handleSubmit: async (
    values,
    { props: { resetPassword = () => {}, onClose = () => {} }, setSubmitting },
  ) => {
    await resetPassword({
      variables: values,
    })
    toaster.success('eMail mit Reset Link versendet')
    setSubmitting(false)
    onClose()
  },
})(ResetPasswordDialog)
