import { schemas } from '@camcloud/common'
import useFormal from '@kevinwolf/formal-native'
import { ApolloError } from 'apollo-boost'
import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, KeyboardAvoidingView, Picker, Text } from 'react-native'
import { NavigationScreenComponent } from 'react-navigation'
import styled from 'styled-components/native'

import Page from '../../../components/Page'
import { Field } from '../../../components/TextInput'
import supportedCams from '../../../data/supportedCams'
import {
  AllCamerasDocument,
  useAddCameraMutation,
  useEditCameraMutation,
  useGetCameraQuery,
  useRemoveCameraMutation,
} from '../../../generated/ApolloHooks'
import { StyledScrollView } from './Detail'

const Flex = styled.View`
  flex-direction: row;
`

export const ButtonWrapper = styled.View`
  margin-top: 40px;
`

const StretchedField = styled(Field)`
  flex: 1;
`

const onError = (error: ApolloError, setErrorProxy) => {
  if (error.graphQLErrors.find(x => x.message === 'InvalidHost')) {
    setErrorProxy({
      address:
        'Dieser Host ist nicht erreichbar, bitte geh sicher dass der Host aus dem Internet erreichbar ist.',
    })
  }
  if (error.graphQLErrors.find(x => x.message === 'InvalidCreds')) {
    setErrorProxy({
      usr: 'Die Login Kombination für die Kamera ist ungültig.',
    })
  }
  if (error.graphQLErrors.find(x => x.message === 'LimitExceeded')) {
    setErrorProxy({
      name:
        'Sie nutzen den FREE Plan und haben bereits eine Kamera hinzugefügt oder ihr Testzeitraum ist abgelaufen',
    })
  }
}

const onCompleted = navigation => {
  navigation.navigate('CamerasMain')
}

const AddCameraScreen: NavigationScreenComponent<{
  readyForSave?: boolean
  onSave: () => void

  editMode: boolean
  id: string
}> = ({ navigation }) => {
  const [errorProxy, setErrorProxy] = useState({})
  const [addCamera] = useAddCameraMutation({
    onError: error => onError(error, setErrorProxy),
    update: (cache, { data: { addCamera } }) => {
      const { me } = cache.readQuery({ query: AllCamerasDocument })
      cache.writeQuery({
        query: AllCamerasDocument,
        data: {
          me: {
            ...me,
            cameras: [...me.cameras, addCamera],
          },
        },
      })
    },
    onCompleted: () => onCompleted(navigation),
  })
  const [updateCamera] = useEditCameraMutation({
    onError: error => onError(error, setErrorProxy),
    update: (cache, { data: { updateCamera } }) => {
      const { me } = cache.readQuery({ query: AllCamerasDocument })
      cache.writeQuery({
        query: AllCamerasDocument,
        data: {
          me: {
            ...me,
            cameras: [
              ...me.cameras.map(cam => {
                if (cam._id !== updateCamera._id) return cam
                return updateCamera
              }),
            ],
          },
        },
      })
    },
    onCompleted: () => onCompleted(navigation),
  })
  const [removeCamera] = useRemoveCameraMutation({
    onError: error => onError(error, setErrorProxy),
    update: (cache, { data: { removeCamera } }) => {
      const { me } = cache.readQuery({ query: AllCamerasDocument })
      cache.writeQuery({
        query: AllCamerasDocument,
        data: {
          me: {
            ...me,
            cameras: [
              ...me.cameras.filter(cam => cam._id !== removeCamera._id),
            ],
          },
        },
      })
    },
    onCompleted: () => onCompleted(navigation),
  })
  const { data, loading } = useGetCameraQuery({
    variables: {
      id: navigation.getParam('id'),
    },
    skip: !navigation.getParam('editMode'),
  })
  const editMode = navigation.getParam('editMode')
  const {
    getFieldProps,
    isDirty,
    isSubmitting,
    isValidating,
    submit,
    values,
    clearErrors,
    setErrors,
  } = useFormal(
    editMode && !loading
      ? {
          name: data.camera.name,
          model: data.camera.model,
          address: data.camera.address,
          http: data.camera.http.toString(),
          rtsp: data.camera.rtsp.toString(),
          usr: data.camera.usr,
          pwd: '',
        }
      : {
          name: '',
          model: 'C1',
          address: '',
          http: '80',
          rtsp: '554',
          usr: 'admin',
          pwd: '',
        },
    {
      schema: schemas.addCameraSchema,
      onSubmit: async values => {
        clearErrors()
        if (editMode) {
          await updateCamera({
            variables: {
              ...values,
              http: parseInt(values.http, 10),
              rtsp: parseInt(values.rtsp, 10),
              id: navigation.getParam('id'),
            },
          })
        } else {
          await addCamera({
            variables: {
              ...values,
              http: parseInt(values.http, 10),
              rtsp: parseInt(values.rtsp, 10),
            },
          })
        }
      },
    },
  )

  useMemo(() => {
    if (errorProxy) setErrors(errorProxy)
  }, [errorProxy])

  useEffect(() => {
    navigation.setParams({
      onSave: () => submit(),
      readyForSave: isDirty && !isValidating && !isSubmitting,
    })
  }, [values, isDirty, isSubmitting, isValidating])

  const pickerProps = getFieldProps('model')
  return (
    <Page paddingTop={20} paddingBottom={0}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={120}>
        <StyledScrollView>
          <Text>Wähle dein Kamera Model aus:</Text>
          <Picker
            selectedValue={pickerProps.value}
            onValueChange={(itemValue: string) =>
              pickerProps.onChangeText(itemValue)
            }
          >
            {supportedCams.map(cam => (
              <Picker.Item key={cam.name} label={cam.name} value={cam.name} />
            ))}
          </Picker>
          <Field
            label="Name"
            description="Die Kamera wird Ihnen künftig mit diesem Namen angezeigt"
            {...getFieldProps('name')}
          />
          <Field
            label="Adresse"
            description="Wie ist ihre Kamera im Internet zu erreichen? Zum Beispiel: xxxxxx.myfoscam.org oder eine statische IP wie 223.17.92.203"
            {...getFieldProps('address')}
          />
          <Flex>
            <StretchedField
              style={{ marginRight: 5 }}
              label="HTTP Port"
              keyboardType="numeric"
              {...getFieldProps('http')}
            />
            <StretchedField
              style={{ marginLeft: 5 }}
              keyboardType="numeric"
              label="RTSP Port"
              {...getFieldProps('rtsp')}
            />
          </Flex>
          <Flex>
            <StretchedField
              style={{ marginRight: 5 }}
              label="Kamera User"
              {...getFieldProps('usr')}
            />
            <StretchedField
              style={{ marginLeft: 5 }}
              label="Kamera Password"
              {...getFieldProps('pwd')}
            />
          </Flex>
          {editMode && (
            <ButtonWrapper>
              <Button
                title="Löschen"
                color="red"
                onPress={() => {
                  Alert.alert(
                    `Wollen sie "${data.camera.name}" wirklich löschen?`,
                    null,
                    [
                      {
                        text: 'Kamera löschen',
                        onPress: () => {
                          removeCamera({
                            variables: { id: navigation.getParam('id') },
                          })
                        },
                        style: 'destructive',
                      },
                      {
                        text: 'Abbrechen',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ],
                    { cancelable: true },
                  )
                }}
              />
            </ButtonWrapper>
          )}
        </StyledScrollView>
      </KeyboardAvoidingView>
    </Page>
  )
}

AddCameraScreen.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('editMode')
    ? 'Kamera bearbeiten'
    : 'Kamera hinzufügen',
  headerRight: (
    <Button
      title="Speichern"
      onPress={navigation.getParam('onSave')}
      disabled={!navigation.getParam('readyForSave')}
    />
  ),
})

export default AddCameraScreen
