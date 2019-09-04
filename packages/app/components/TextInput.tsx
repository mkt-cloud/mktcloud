import React from 'react'
import { TextInputProps } from 'react-native'
import styled from 'styled-components/native'

const TextInput = styled.TextInput`
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 5px;
`

const FieldWrapper = styled.View`
  margin: 5px 0;
`

const DescriptionText = styled.Text`
  color: #8f8e93;
  font-size: 12px;
  margin-bottom: 2px;
`

const ErrorText = styled.Text`
  margin-top: 2px;
  color: red;
  font-size: 12px;
`

const Label = styled.Text`
  margin-bottom: 2px;
`

export const Field: React.FC<
  { label: String; description?: String | null; error?: any } & TextInputProps
> = ({ label, description = null, error = null, style, ...props }) => {
  return (
    <FieldWrapper style={style}>
      <Label>{label}</Label>
      {description && <DescriptionText>{description}</DescriptionText>}
      <TextInput autoCapitalize="none" {...props} />
      {error && <ErrorText>{error}</ErrorText>}
    </FieldWrapper>
  )
}

export default TextInput
