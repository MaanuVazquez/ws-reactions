import mongoose, { Mongoose, Model, Schema } from 'mongoose'
import { uuid } from 'uuidv4'

const REACTIONS = ['clap', 'heart', 'muscle']

const Class = new mongoose.Schema({
  id: String,
  reactions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Reaction'
    }
  ]
})

const Reaction = new mongoose.Schema({
  id: String,
  reaction: String,
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
    const connectToMongo = (): void => {
      mongoose
        .connect('mongodb://mongo:27017/reaction', { useNewUrlParser: true })
        .then(m => {
          this.mongoose = m
          this.mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
          this.ClassModel = this.mongoose.model('Class', Class, 'classes')
          this.ReactionModel = this.mongoose.model('Reaction', Reaction, 'reactions')
        })
        .catch(() => {
          console.log('trying to connect to mongo…')
          setTimeout(connectToMongo, 5000)
        })
    }
    connectToMongo()
  }

  async react(classId: string, reaction: string, time?: number): Promise<void> {
    if (!REACTIONS.includes(reaction.toLowerCase()) || !this.ReactionModel || !this.ClassModel) return

    const newReaction = new this.ReactionModel({
      id: uuid(),
      reaction,
      time,
      classId
    })
    await newReaction.save()

    const classModified = await this.ClassModel.findOne({ id: classId })
    classModified.reactions.push(newReaction)
    await classModified.save()

    return newReaction
  }

  async getClass(id: string): Promise<void> {
    if (!this.ClassModel) return
    const reactionClass = await this.ClassModel.findOne({ id }).populate('reactions')
    if (reactionClass) {
      console.log(reactionClass)
      return reactionClass
    }

    const newReactionClass = new this.ClassModel({
      id
    })
    await newReactionClass.save()

    return newReactionClass
  }
}
