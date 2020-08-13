import mongoose, { Schema } from 'mongoose'
import { ALLOWED_REACTIONS } from './Reaction'

const ClassSchema = new mongoose.Schema({
  id: String,
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reaction'
    }
  ]
})

const getDefaultReactions = (): any => {
  return ALLOWED_REACTIONS.reduce((accum: any, reactionType: string) => {
    accum[reactionType] = 0
    return accum
  }, {})
}

ClassSchema.methods.totalReactions = function (): any {
  if (!this?.reactions.length) return getDefaultReactions()

  return this.reactions.reduce((accum: any, classReaction: any) => {
    accum[classReaction.reaction] = accum[classReaction.reaction] ? accum[classReaction.reaction] + 1 : 1
    return accum
  }, getDefaultReactions())
}

ClassSchema.methods.reactionsBySegments = function (): any {
  if (!this?.reactions.length) return []

  const reactionsBySegments = this.reactions.reduce((accum: any, classReaction: any) => {
    const segmentReactions = accum[classReaction.segmentIndex]
      ? accum[classReaction.segmentIndex]
      : getDefaultReactions()
    accum[classReaction.segmentIndex] = {
      ...segmentReactions,
      [classReaction.reaction]: segmentReactions[classReaction.reaction] + 1
    }
    return accum
  }, [])

  for (let i = 0; i < reactionsBySegments.length; i++) {
    if (!reactionsBySegments[i]) {
      reactionsBySegments[i] = null
    }
  }

  return reactionsBySegments
}

export default ClassSchema
