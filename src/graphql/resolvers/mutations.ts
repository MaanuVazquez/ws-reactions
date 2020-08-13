import pubsub, { CLASS_REACTED } from '../pubsub'

async function react(_: unknown, { classId, reaction }: any, ctx: any): Promise<any> {
  const result = await ctx.reaction.react(classId, reaction)
  pubsub.publish(CLASS_REACTED, { classReacted: result })
  return ctx.reaction.getClass(classId)
}

export default {
  Mutation: {
    react
  }
}
