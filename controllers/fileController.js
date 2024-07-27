const File = require("../models/file")
const path = require('path')
const fs = require('fs')
const i18n = require('../i18n/i18n')
const fileQueue = require('../redis/queue')

const uploadFile = async(req, res) => {
    try {
        const { originalname, filename, path, size, mimetype } = req.file;
        const userId = req.user.userId;
    
        // Add job to the queue with progress tracking
        const job = await fileQueue.add('upload-file', {
        originalname,
        filename,
        filepath: path,
        size,
        mimetype,
        userId,
    });

    return res.status(201).json({msg:i18n.__('upload201'), jobId: job.id})
    } catch (err) {
    console.log(err)
    return res.status(500).json({msg:i18n.__('error')})
    }
}

const getAllFiles = async(req, res) => {
    try {
        const userId = req.user.userId;
        const files = await File.findAll({ where: { userId } });
        return res.status(200).json({files});
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg:i18n.__('error')})
    }
}

const getOneFile = async(req, res) => {
    try {
        const fileId = req.params.fileId
        const file = await File.findOne({ where: { id: fileId } });
        res.status(200).json({file});
    } catch (err) {
        return res.status(500).json({msg:i18n.__('error')})
    }
}

const updateFile = async(req,res) => {
    try {
        const { newName } = req.body;
        const file = await File.findByPk(req.params.fileId);
        if (!file) {
          return res.status(404).json({msg:i18n.__('update404')})
        }
    
        const newFilePath = path.join(path.dirname(file.filepath), newName);
        fs.renameSync(file.filepath, newFilePath);
    
        file.originalName = newName;
        file.filepath = newFilePath;
        await file.save();
    
        res.status(200).json({msg:i18n.__('update200'), file})
    } catch (err) {
        return res.status(500).json({msg:i18n.__('error')})
    }  
}

const deleteAllFiles = async(req,res) => {
    try {
        const userId = req.user.userId;
        const files = await File.findAll({ where: { userId } });
    
        if (files.length === 0) {
            return res.status(404).json({msg:i18n.__('deleteAll404')})
        }
    
        for (const file of files) {
          fs.unlinkSync(file.filepath);
          await file.destroy();
        }
    
        return res.status(200).send({msg:i18n.__('deleteAll200'), count: files.length});
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg:i18n.__('error')})
    }
}

const deleteOneFile = async(req,res) => {
    try {
        const file = await File.findByPk(req.params.fileId);
        if (!file) {
            return res.status(404).json({msg:i18n.__('deleteOne404')})
        }
    
        fs.unlinkSync(file.filepath);
        await file.destroy();
    
        return res.status(204).json({})
    } catch (err) {
        console.log(err)
        return res.status(500).json({msg:i18n.__('error')})
    }
}


const getJobProgress = async (req, res) => {
    try {
      const jobId = req.params.jobId;
      const job = await fileQueue.getJob(jobId);
  
      if (job) {
        const result = await job.finished()
        return res.status(200).json({
          jobId: job.id,
          progress: job.progress(),
          status: await job.getState(),
          result: result
        });
      } else {
        return res.status(404).json({ msg: i18n.__('error') });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: i18n.__('error') });
    }
};

module.exports = {
    uploadFile,
    getAllFiles,
    getOneFile,
    updateFile,
    deleteAllFiles,
    deleteOneFile,
    getJobProgress
}