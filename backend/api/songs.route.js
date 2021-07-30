import express from "express"
import SongsCtrl from "./songs.controller.js"

const router = express.Router()

router.route("/").get(SongsCtrl.apiGetSongs)
router.route("/id/:id").get(SongsCtrl.apiGetSongById)
router.route("/genres").get(SongsCtrl.apiGetSongGenres)

router
  .route("/song")
  .post(SongsCtrl.apiPostSong)
  .put(SongsCtrl.apiUpdateSong)
  .delete(SongsCtrl.apiDeleteSong)

  // http://localhost:5000/api/v1/songs/song

export default router