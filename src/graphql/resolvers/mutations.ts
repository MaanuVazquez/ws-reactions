import pubsub, { CLASS_REACTED } from '../pubsub'

async function react(_: unknown, { classId, reaction }: any, ctx: any): Promise<any> {
  console.log('asd')
  const result = await ctx.reaction.react(classId, reaction)
  pubsub.publish(CLASS_REACTED, { classReacted: result })
  console.log(result)
  return result
}

export default {
  Mutation: {
    react
  }
}
