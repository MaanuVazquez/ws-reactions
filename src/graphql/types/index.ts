import { fileLoader, mergeTypes } from 'merge-graphql-schemas'

const typesArray = fileLoader(__dirname)
export default mergeTypes(typesArray, { all: true })
