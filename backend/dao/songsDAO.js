import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let songs

export default class SongsDAO {
  static async injectDB(conn) {
    if (songs) {
      return
    }
    try {
      songs = await conn.db(process.env.RESTSONG_NS).collection("SongCollection")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in songsDAO: ${e}`,
      )
    }
  }

  static async getSongs({
    filters = null,
    page = 0,
    songsPerPage = 20,
  } = {}) {
    let query
    if (filters) {
      if ("title" in filters) {
        query = { $text: { $search: filters["title"] } }
      } else if ("artist" in filters) {
        query = { "artist": { $eq: filters["artist"] } }
      } else if ("genre" in filters) {
        query = { "genre": { $eq: filters["genre"] } }
      }
    }

    let cursor
    
    try {
      cursor = await songs
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { songsList: [], totalNumSongs: 0 }
    }

    const displayCursor = cursor.limit(songsPerPage).skip(songsPerPage * page)

    try {
      const songsList = await displayCursor.toArray()
      const totalNumSongs = await songs.countDocuments(query)
	  console.log(`total # of songs=${totalNumSongs}`)
      return { songsList, totalNumSongs }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { songsList: [], totalNumSongs: 0 }
    }
  }

  static async getSongByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$song_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await songs.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getSongByID: ${e}`)
      throw e
    }
  }

//   static async getGenres() {
//     let genres = []
//     try {
// 		genres = await songs.distinct("genre")
//       return genres
//     } catch (e) {
//       console.error(`Unable to get genres, ${e}`)
//       return genres
//     }
//   }
}


