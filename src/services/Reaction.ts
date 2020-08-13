import mongoose, { Mongoose, Model } from 'mongoose'
import { uuid } from 'uuidv4'

const REACTIONS = ['clap', 'heart', 'muscle']

const Class = new mongoose.Schema({
  id: String,
  reactions: {
    type: String,
    ref: 'Reaction'
  }
})

const Reaction = new mongoose.Schema({
  id: String,
  type: String,
  time: Number,
  classId: {
    type: String,
    ref: 'Class'
  }
})

let instance: ReactionService | null = null

export default class ReactionService {
  static getInstance(): ReactionService {
    if (!instance) {
      instance = new ReactionService()
    }

    return instance
  }

  mongoose: Mongoose | null = null
  ClassModel: Model<any> | null = null
  ReactionModel: Model<any> | null = null

  constructor() {
    mongoose.connect('mongodb://localhost/reaction', { useNewUrlParser: true }).then(m => {
      this.mongoose = m
      this.mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
      this.ClassModel = this.mongoose.model('Class', Class)
      this.ClassModel = this.mongoose.model('Reaction', Reaction)
    })
  }

  async react(classId: string, reaction: string, time?: number): Promise<void> {
    if (!REACTIONS.includes(reaction.toLowerCase()) || !this.ReactionModel) return

    const newReaction = new this.ReactionModel({
      id: uuid(),
      reaction,
      time,
      classId
    })
    await newReaction.save()

    return newReaction
  }

  async getClass(id: string): Promise<void> {
    if (!this.ClassModel) return
    const reactionClass = await this.ClassModel.findOne({ id }).populate('reactions')
    if (reactionClass) return reactionClass

    const newReactionClass = new this.ClassModel({
      id
    })
    await newReactionClass.save()

    return newReactionClass
  }
}
