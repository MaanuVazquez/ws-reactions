import { withFilter } from 'apollo-server'
import pubsub, { CLASS_REACTED } from '../pubsub'

export default {
  Subscription: {
    classReacted: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator(CLASS_REACTED),
        (payload, variables) => {
          return payload.classReacted.classId === variables.id
        }
      )
    }
  }
}
