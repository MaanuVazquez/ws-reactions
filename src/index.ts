import { ApolloServer, AuthenticationError, ForbiddenError } from 'apollo-server'
import * as pubsub from './graphql/pubsub'

import resolvers from 'graphql/resolvers'
import typeDefs from 'graphql/types'

import ReactionService from 'services/Reaction'

ReactionService.getInstance()
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context(): any {
    return {
      reaction: ReactionService.getInstance()
    }
  },
  formatError(error): Error {
    if (process.env.NODE_ENV !== 'production') return error
    if (error.originalError instanceof AuthenticationError || error.originalError instanceof ForbiddenError) {
      return error
    }
    console.error(error.message)
    return new Error('Internal server error')
  }
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
