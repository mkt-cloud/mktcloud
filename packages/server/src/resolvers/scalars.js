import { GraphQLScalarType, Kind } from 'graphql'

export const pad = (length, filler = 0) => val =>
  `${
    length - val.toString().length > 0
      ? Array(length - val.toString().length)
          .fill(filler)
          .join('')
      : ''
  }${val}`

const generatePaddedBitMapType = length => {
  const padX = pad(length)
  return new GraphQLScalarType({
    name: `BitMap${length}`,
    description: `Represents a (long) integer in a binary string (${length})`,
    serialize: value => padX((+value).toString(2)),
    parseValue: value => parseInt(value, 2),
    parseLiteral: ast => ast.kind === Kind.STRING && parseInt(ast.value, 2),
  })
}

export const bitMapType = new GraphQLScalarType({
  name: 'BitMap',
  description: 'Represents a (long) integer in a binary string',
  serialize: value => (+value).toString(2),
  parseValue: value => parseInt(value, 2),
  parseLiteral: ast => ast.kind === Kind.STRING && parseInt(ast.value, 2),
})

export default {
  BitMap: bitMapType,
  BitMap48: generatePaddedBitMapType(48),
  BitMap10: generatePaddedBitMapType(10),
}
