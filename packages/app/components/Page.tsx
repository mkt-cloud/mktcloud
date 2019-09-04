import styled from 'styled-components/native'

interface PageProps {
  paddingTop?: number
  paddingX?: number
  paddingBottom?: number
}

const Page = styled.View<PageProps>`
  padding: ${({ paddingTop = 40 }) => paddingTop}px
    ${({ paddingX = 20 }) => paddingX}px
    ${({ paddingBottom = 120 }) => paddingBottom}px;
`

export default Page
