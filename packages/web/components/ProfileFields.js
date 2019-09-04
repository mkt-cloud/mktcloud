import { Pane } from 'evergreen-ui'
import { Field } from 'formik'
import TextInputField from './formik-evergreen/TextInputField'

export default () => (
  <>
    <Pane display="grid" gridTemplateColumns="repeat(2, 1fr)" gridGap="1em">
      <Field
        name="firstName"
        label="Vorname"
        width="100%"
        component={TextInputField}
      />
      <Field
        name="lastName"
        label="Nachname"
        width="100%"
        component={TextInputField}
      />
    </Pane>
    <Field
      name="email"
      type="email"
      label="eMail"
      width="100%"
      component={TextInputField}
    />
  </>
)
