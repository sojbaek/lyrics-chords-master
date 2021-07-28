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

//   static async apiGetSongGenres(req, res, next) {
//     try {
//       let genres = await SongsDAO.getGenres()
//       res.json(genres)
//     } catch (e) {
//       console.log(`api, ${e}`)
//       res.status(500).json({ error: e })
//     }
//   }
}