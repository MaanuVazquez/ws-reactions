export default {
  Query: {
    getClassReactions: async function (_: unknown, { id }: any, ctx: any): Promise<any> {
      const result = await ctx.reaction.getClass(id)
      return {
        id: result.id,
        reactions: result.reactions,
        totalReactions: result.totalReactions(),
        reactionsBySegment: result.reactionsBySegments()
      }
    }
  }
}
