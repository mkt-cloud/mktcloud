import { schemas } from '@camcloud/common'
import useFormal from '@kevinwolf/formal-native'
import React, { useEffect, useMemo, useState } from 'react'
import { AsyncStorage, Button, KeyboardAvoidingView } from 'react-native'
import { NavigationActions, NavigationScreenComponent } from 'react-navigation'
import styled from 'styled-components/native'

import Page from '../../../components/Page'
import { Field } from '../../../components/TextInput'
import { useMeQuery, useUpdateMeMutation } from '../../../generated/ApolloHooks'

const Flex = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const SettingsEditScreen: NavigationScreenComponent<{
  onSave: () => void
  readyForSave: boolean
}> = ({ navigation }) => {
  const { data, error, loading } = useMeQuery()
  if (error) {
    AsyncStorage.clear(() => {
      navigation.navigate(
        'AuthLoader',
        {},
        NavigationActions.navigate({ routeName: 'AuthLoader' }),
      )
    })
  }
  const [updateMe] = useUpdateMeMutation({
    onCompleted: () => {
      navigation.navigate('SettingsMain')
    },
  })
  const {
    getFieldProps,
    isDirty,
    isSubmitting,
    isValidating,
    values,
    submit,
  } = useFormal(
    {
      firstName: data.me.firstName,
      lastName: data.me.lastName,
      email: data.me.email,
    },
    {
      onSubmit: async values => {
        await updateMe({
          variables: values,
        })
      },
      schema: schemas.profileSchema,
    },
  )

  useEffect(() => {
    navigation.setParams({
      onSave: () => submit(),
      readyForSave: isDirty && !isValidating && !isSubmitting,
    })
  }, [values, isDirty, isSubmitting, isValidating])

  return (
    <Page paddingTop={20}>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={120}>
        <Field label="Vorname" autoFocus {...getFieldProps('firstName')} />
        <Field label="Nachname" {...getFieldProps('lastName')} />
        <Field
          label="eMail"
          keyboardType="email-address"
          autoCompleteType="email"
          {...getFieldProps('email')}
        />
      </KeyboardAvoidingView>
    </Page>
  )
}

SettingsEditScreen.navigationOptions = ({ navigation }) => ({
  title: 'Profil bearbeiten',
  headerRight: (
    <Button
      title="Speichern"
      onPress={navigation.getParam('onSave')}
      disabled={!navigation.getParam('readyForSave')}
    />
  ),
})

export default SettingsEditScreen
