import styled from 'styled-components/native'

interface HeadingProps {
  readonly center?: boolean
}

export default styled.Text<HeadingProps>`
  font-size: 42px;
  margin: 10px 0 20px 0;
  font-weight: 600;
  ${({ center = false }) =>
    center
      ? `width: 100%;
  text-align: center;`
      : ''}
`

export const H2 = styled.Text<HeadingProps>`
  font-size: 24px;
  margin: 5px 0 10px 0;
  font-weight: 600;
  ${({ center = false }) =>
    center
      ? `width: 100%;
text-align: center;`
      : ''}
`
