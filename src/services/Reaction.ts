import mongoose, { Mongoose, Model } from 'mongoose'
import { uuid } from 'uuidv4'
import { ClassSchema, ReactionSchema } from '../schema'
import { ALLOWED_REACTIONS } from 'schema/Reaction'

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
      const connectionString =
        process.env.NODE_ENV === 'development' ? 'mongodb://localhost/reaction' : 'mongodb://mongo:27017/reaction'
      mongoose
        .connect(connectionString, { useNewUrlParser: true })
        .then(m => {
          this.mongoose = m
          this.mongoose.connection.on('error', console.error.bind(console, 'connection error:'))
          this.ClassModel = this.mongoose.model('Class', ClassSchema, 'classes')
          this.ReactionModel = this.mongoose.model('Reaction', ReactionSchema, 'reactions')
        })
        .catch(() => {
          console.log('trying to connect to mongo…')
          setTimeout(connectToMongo, 5000)
        })
    }
    connectToMongo()
  }

  async react(classId: string, reaction: string, segmentIndex: number): Promise<void> {
    if (!ALLOWED_REACTIONS.includes(reaction.toLowerCase()) || !this.ReactionModel || !this.ClassModel) return

    const newReaction = new this.ReactionModel({
      id: uuid(),
      reaction,
      segmentIndex,
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
      return reactionClass
    }

    const newReactionClass = new this.ClassModel({
      id
    })
    await newReactionClass.save()
    await this.generateRandomReacts(newReactionClass.id)

    return this.ClassModel.findOne({ id }).populate('reactions')
  }

  async generateRandomReacts(classId: string): Promise<void[]> {
    const reactsToCreate = Math.floor(Math.random() * 40) + 1
    const reactType = ALLOWED_REACTIONS[Math.floor(Math.random() * 3)]
    const reactSegment = Math.round(Math.random())

    return Promise.all(
      Array.from(Array(reactsToCreate), () => {
        return this.react(classId, reactType, reactSegment)
      })
    )
  }
}
