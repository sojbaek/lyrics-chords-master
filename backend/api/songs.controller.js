import SongsDAO from "../dao/songsDAO.js"

export default class SongsController {
	
  static async apiGetSongs(req, res, next) {
    const songsPerPage = req.query.songsPerPage ? parseInt(req.query.songsPerPage, 10) : 20
    const page = req.query.page ? parseInt(req.query.page, 10) : 0

    let filters = {}
    if (req.query.genre) {
      filters.genre = req.query.genre
    } else if (req.query.artist) {
      filters.artist = req.query.artist
    } else if (req.query.title) {
      filters.title = req.query.title
    }

    const { songsList, totalNumSongs } = await SongsDAO.getSongs({
      filters,
      page,
      songsPerPage,
    })

    let response = {
      songs: songsList,
      page: page,
      filters: filters,
      entries_per_page: songsPerPage,
      total_results: totalNumSongs,
    }
    res.json(response)
  }

  static async apiGetSongById(req, res, next) {
    try {
      let id = req.params.id || {}
      let song = await SongsDAO.getSongByID(id)
      console.log(`songs.controller:apiGetSongById(${id})`)
      if (!song) {
        res.status(404).json({ error: "Not found" })
        return
      }
      res.json(song)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetSongGenres(req, res, next) {
    try {
      let genres = await SongsDAO.getGenres()
      res.json(genres)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiPostSong(req, res, next) {
    try {
      //const restaurantId = req.body.restaurant_id
      //const review = req.body.text
      const title = req.body.title
      const artist = req.body.artist
      const lyric = req.body.lyric
      const youtube = req.body.youtube
      const genre = req.body.genre
      const userInfo = {
        name: req.body.name,
        _id: req.body.user_id
      }
      //const date = new Date()
      const SongResponse = await SongsDAO.addSong(
        userInfo,
        title,
        artist,
        lyric,
        youtube,
        genre
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiUpdateSong(req, res, next) {
    try {
      const songId = req.body.song_id
      const title = req.body.title
      const artist = req.body.artist
      const lyric = req.body.lyric
      const youtube = req.body.youtube
      const genre = req.body.genre
      updateSong(songID, userId, title, artist, lyric, youtube, genre) 
      const songResponse = await SongsDAO.updateSong(
        songId, 
        req.body.user_id,
        title,
        artist,
        lyric,
        youtube,
        genre,
      )

      var { error } = songResponse
      if (error) {
        res.status(400).json({ error })
      }

      if (songResponse.modifiedCount === 0) {
        throw new Error(
          "unable to update the song - user may not be original poster",
        )
      }
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  static async apiDeleteSong(req, res, next) {
    try {
      const songId = req.query.id
      const userId = req.body.user_id
      console.log(songId)
      const reviewResponse = await SongsDAO.deleteSong(
        songId,
        userId,
      )
      res.json({ status: "success" })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }
}