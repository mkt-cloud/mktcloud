import NextLink from 'next/link'
import { Link as UiLink } from 'evergreen-ui'

const buildReducer = props => [
  (acc, cur) => ({
    ...acc,
    [cur]: props[cur],
  }),
  {},
]

const Link = props => {
  const nextLinkPropNames = [
    'href',
    'as',
    'prefetch',
    'replace',
    'shallow',
    'passHref',
    'scroll',
  ]
  const nextLinkProps = nextLinkPropNames.reduce(...buildReducer(props))
  const uiLinkProps = Object.keys(props)
    .filter(key => !nextLinkPropNames.includes(key))
    .reduce(...buildReducer(props))

  return (
    <NextLink {...nextLinkProps}>
      <UiLink {...uiLinkProps} />
    </NextLink>
  )
}

Link.defaultProps = {
  passHref: true,
}

export default Link
