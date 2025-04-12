import express from 'express'
import { protect } from '../middleware/AuthMiddleware.js'
import { CreateProject, DeleteProject, fetchAllProject, fetchProjectID, RegenerateApiKey } from '../controller/ProjectController.js'

export const projectRouter = express.Router()

projectRouter.post('/create',protect,CreateProject)
projectRouter.get('/fetch',protect,fetchAllProject)
projectRouter.post('/fetch/:id',protect,fetchProjectID)
projectRouter.delete('/delete/:id',protect,DeleteProject)
projectRouter.post('/regenerateApiKey',protect,RegenerateApiKey)




