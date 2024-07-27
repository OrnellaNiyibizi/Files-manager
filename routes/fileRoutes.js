const {Router} = require('express')
const authenticateToken = require('../middleware/authenticateToken')
const {
    uploadFile,
    getAllFiles,
    getOneFile,
    updateFile,
    deleteAllFiles,
    deleteOneFile,
    getJobProgress
} = require('../controllers/fileController')
const upload = require('../middleware/multer')

const fileRouter = Router()

fileRouter.use(authenticateToken)

fileRouter.route('/').post(upload.single('file'), uploadFile).get(getAllFiles).delete(deleteAllFiles)
fileRouter.route('/:fileId').get(getOneFile).patch(updateFile).delete(deleteOneFile)
fileRouter.get('/job/:jobId', getJobProgress)


module.exports = fileRouter