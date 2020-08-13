import pubsub, { CLASS_REACTED } from '../pubsub'

async function react(_: unknown, { classId, reaction, segmentIndex }: any, ctx: any): Promise<any> {
  const result = await ctx.reaction.react(classId, reaction, segmentIndex)
  pubsub.publish(CLASS_REACTED, { classReacted: result })
  return result
}

export default {
  Mutation: {
    react
  }
}
