
import { Movie, TrendingMovie } from "@/interfaces/interfaces";
import {Client, Databases, ID, Query} from 'react-native-appwrite'

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!
const COLLECTION_ID =  process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!

const client =  new Client().setEndpoint('https://cloud.appwrite.io/v1').setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

const databases = new Databases(client)

// track searches made by users
export const updateSearchCount = async (query:string,movie:Movie) =>{
  try {
    
  // check if a record exist for the query
  const results = await databases.listDocuments(DATABASE_ID,COLLECTION_ID,[Query.equal('searchTerm',query)])

  console.log(results)

  // if exists, increment the count
  if(results.documents.length > 0){
    const existingMovie = results.documents[0]

    await databases.updateDocument(DATABASE_ID,COLLECTION_ID,existingMovie.$id,
      {
      count:existingMovie.count +1
    })
  }else{
    // if not, create a new record
    await databases.createDocument(DATABASE_ID,COLLECTION_ID,ID.unique(),{
      searchTerm:query,
      movie_id:movie.id,
      count:1,
      poster_url:`https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
      title:movie.title

    })
  }

  } catch (error) {
    console.log(error)
    throw error
  }
  
  
}

export const getTrendingMovies = async(): Promise<TrendingMovie[] |undefined> =>{
 try {
  const result = await databases.listDocuments(DATABASE_ID,COLLECTION_ID,[Query.limit(5),
    Query.orderDesc('count')
  ])

  return result.documents as unknown as TrendingMovie[]
 } catch (error) {
  console.log(error)
  return undefined
 }
}