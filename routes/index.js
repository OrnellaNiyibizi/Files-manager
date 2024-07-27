const {Router} = require('express')
const authRoutes = require('./authRoutes.js')
const fileRoutes = require('./fileRoutes.js')

const router = Router()

router.use('/auth', authRoutes)
router.use('/files', fileRoutes)

module.exports = router