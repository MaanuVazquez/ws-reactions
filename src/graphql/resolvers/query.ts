export default {
  Query: {
    getClassReactions: async function (_: unknown, { id }: any, ctx: any): Promise<any> {
      return ctx.reaction.getClass(id)
    }
  }
}