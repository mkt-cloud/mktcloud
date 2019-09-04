import { useState } from 'react'
import propTypes from 'prop-types'
import { Button, Alert, Pane, Position, Dialog } from 'evergreen-ui'
import { SelectMenuField, TextInputField } from './formik-evergreen'
import Center from './Center'
import { Form, Field, withFormik } from 'formik'

import supportedCams from '../data/supportedCams'
import { schemas } from '@camcloud/common'

const SelectModel = props => (
  <Field
    title="Kamera Model"
    name="model"
    component={SelectMenuField}
    options={supportedCams.map(x => ({ ...x, label: x.name, value: x.name }))}
    labelProps={{ textAlign: 'center' }}
    position={Position.BOTTOM}
    {...props}
  />
)

const Page1 = ({ nextPage, values }) => (
  <Center x={true} y={true} height="50vh">
    <SelectModel onSelect={nextPage}>
      <Button appearance="primary" type="button" width="240px" height="40">
        {values.model
          ? `Ausgewählte Kamera: ${values.model}`
          : `Bitte wählen Sie Ihre Kamera`}
      </Button>
    </SelectModel>
  </Center>
)
const Page2 = ({
  isSubmitting,
  values: { name, model },
  submitBtn,
  dirty,
  executeDeleteMutation,
  _id,
}) => {
  const [showDeletePopup, setShowDeletePopup] = useState(false)
  return (
    <Center flexDirection="columns" paddingTop="1em">
      <Pane maxWidth="500px" width="100%">
        <Center>
          <SelectModel>
            <Button
              size={600}
              type="button"
              appearance="minimal"
              iconAfter="caret-down"
            >
              {model}
            </Button>
          </SelectModel>
        </Center>
        <Field
          marginTop=".5em"
          name="name"
          label="Name"
          description="Die Kamera wird Ihnen künftig mit diesem Namen angezeigt"
          placeholder="Haustür vorne"
          component={TextInputField}
        />
        <Field
          marginTop=".5em"
          name="address"
          label="Adresse"
          description="Wie ist ihre Kamera im Internet zu erreichen? Zum Beispiel: xxxxxx.myfoscam.org oder eine statische IP wie 223.17.92.203"
          placeholder="xxxxxx.myfoscam.org"
          component={TextInputField}
        />
        <Pane display="flex">
          <Field
            name="http"
            label="HTTP Port"
            placeholder="88"
            component={TextInputField}
            width="100%"
            type="number"
          />
          <Field
            name="rtsp"
            label="RTSP Port"
            placeholder="554"
            marginLeft="1em"
            component={TextInputField}
            width="100%"
            type="number"
          />
        </Pane>
        <Pane display="flex">
          <Field
            name="usr"
            label="Kamera User"
            placeholder="admin"
            component={TextInputField}
            width="100%"
          />
          <Field
            name="pwd"
            label="Kamera Password"
            marginLeft="1em"
            component={TextInputField}
            width="100%"
            type="password"
          />
        </Pane>
        <Pane width="100%" display="flex" justifyContent="flex-end">
          {submitBtn === 'Aktualisieren' && (
            <Button
              intent="danger"
              disabled={isSubmitting || dirty}
              type="button"
              onClick={() => setShowDeletePopup(true)}
              marginRight="1em"
            >
              Entfernen
            </Button>
          )}
          <Button
            appearance="primary"
            disabled={isSubmitting || !dirty}
            type="submit"
          >
            {submitBtn}
          </Button>
        </Pane>
        <Dialog
          isShown={showDeletePopup}
          title={`Kamera "${name}" wirklich löschen?`}
          onConfirm={() =>
            executeDeleteMutation({
              variables: { id: _id },
            })
          }
          onCloseComplete={() => setShowDeletePopup(false)}
          confirmLabel="Kamera löschen"
          cancelLabel="Abbrechen"
          intent="danger"
        >
          Die Kamera und all ihre Events werden unwiderruflich gelöscht. Sind
          Sie sich sicher dass Sie die Kamera und ihre Events (inklusive
          Aufnahmen) löschen möchten?
        </Dialog>
      </Pane>
    </Center>
  )
}

const pages = [x => <Page1 key={1} {...x} />, x => <Page2 key={2} {...x} />]

class AddCamForm extends React.Component {
  state = {
    currentPageIndex: 0,
  }

  render() {
    const {
      error,
      isSubmitting,
      values,
      currentPageIndex: currentPageIndexProps,
      submitBtn = 'Erstellen',
      executeDeleteMutation = () => {},
      _id,
      dirty,
    } = this.props
    const { currentPageIndex } = this.state
    return (
      <Form>
        {error && <Alert intent="danger" title={error} marginBottom="1em" />}
        {pages[currentPageIndexProps || currentPageIndex]({
          nextPage: () =>
            this.setState(s => ({
              currentPageIndex: s.currentPageIndex + 1,
            })),
          values,
          isSubmitting,
          dirty,
          submitBtn,
          executeDeleteMutation,
          _id,
        })}
      </Form>
    )
  }
}

AddCamForm.propTypes = {
  error: propTypes.any,
  isSubmitting: propTypes.bool,
  values: propTypes.any,
}

export default withFormik({
  mapPropsToValues: ({ name, model, address, usr, pwd, http, rtsp }) => ({
    name: name || '',
    model: model || '',
    address: address || '',
    usr: usr || 'admin',
    pwd: pwd || '',
    http: http || 88,
    rtsp: rtsp || 554,
  }),
  validationSchema: schemas.addCameraSchema,
  enableReinitialize: true,
  handleSubmit: async (
    values,
    { props: { executeMutation, _id }, setSubmitting, setErrors },
  ) => {
    try {
      await executeMutation({
        variables: _id ? { ...values, id: _id } : values,
      })
    } catch (e) {
      const { graphQLErrors = [] } = e || {}
      if (graphQLErrors.find(error => error.message === 'InvalidHost')) {
        setErrors({
          address: 'Adresse oder Port falsch! Kamera ist nicht zu erreichen.',
          http: 'Adresse oder Port falsch! Kamera ist nicht zu erreichen.',
          rtsp: 'Adresse oder Port falsch! Kamera ist nicht zu erreichen.',
        })
      }
      if (graphQLErrors.find(error => error.message === 'InvalidCreds')) {
        setErrors({
          usr:
            'Diese User/Password Kombination existiert nicht für Ihre Kamera.',
          pwd:
            'Diese User/Password Kombination existiert nicht für Ihre Kamera.',
        })
      }
      setSubmitting(false)
    }
  },
})(AddCamForm)
