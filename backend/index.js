import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import SongsDAO from "./dao/songsDAO.js"
dotenv.config()

const MongoClient = mongodb.MongoClient
const port = process.env.PORT || 8000


MongoClient.connect(
	process.env.RESTSONGS_DB_URI,
	{
//	  poolSize: 50,
	  wtimeout: 2500,
//	  useNewUrlParse: true
	 }
	)
	.catch(err => {
	  console.error(err.stack)
	  process.exit(1)
	})
	.then(async client => {
	  await SongsDAO.injectDB(client)
	 // await ReviewsDAO.injectDB(client)
	  app.listen(port, () => {
		console.log(`listening on port ${port}`)
	  })
	})