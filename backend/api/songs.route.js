import express from "express"
import SongsCtrl from "./songs.controller.js"

const router = express.Router()

router.route("/").get(SongsCtrl.apiGetSongs)
router.route("/id/:id").get(SongsCtrl.apiGetSongById)
router.route("/songs").get(SongsCtrl.apiGetSongGenres)

router
  .route("/song")
  .post(SongsCtrl.apiPostReview)
  .put(SongsCtrl.apiUpdateReview)
  .delete(SongsCtrl.apiDeleteReview)

export default router