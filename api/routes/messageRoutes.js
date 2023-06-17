import { Router } from 'express'
import { getMessages } from '../controllers/messageControllers.js'
import requireUserToken from '../middlewares/requireUserToken.js'

const router = Router()

router.get("/messages/:_id", requireUserToken,  getMessages)//get all messages from one <user>

export default router