import { fileLoader, mergeResolvers } from 'merge-graphql-schemas'

const resolversArray = fileLoader(__dirname)
export default mergeResolvers(resolversArray)
