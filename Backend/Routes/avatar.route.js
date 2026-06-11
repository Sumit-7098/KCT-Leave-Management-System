import { Router } from 'express'
import multer from 'multer'
import { verifyToken } from '../middleware/auth.js'
import { uploadAvatar } from '../Controller/avatar.controller.js'

const router = Router()

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }) // 5MB

router.post('/avatar', verifyToken, upload.single('avatar'), uploadAvatar)

export default router



