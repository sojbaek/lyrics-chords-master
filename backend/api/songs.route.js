import express from "express"
import SongsCtrl from "./songs.controller.js"
//import LyricsCtrl from "./lyrics.controller.js"

const router = express.Router()

router.route("/").get(SongsCtrl.apiGetSongs)
router.route("/id/:id").get(SongsCtrl.apiGetSongById)
//router.route("/songs").get(SongsCtrl.apiGetSongGenres)

/* 
  router
  .route("/lyric")
  .post(LyricsCtrl.apiPostReview)
  .put(LyricsCtrl.apiUpdateReview)
  .delete(LyricsCtrl.apiDeleteReview)
*/

export default router