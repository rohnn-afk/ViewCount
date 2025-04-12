import crypto from 'crypto'
import { ProjectModel } from '../models/ProjectModel.js'
import { UserModel } from '../models/UsersModel.js'
import { EventModel } from '../models/EventModel.js'


export const CreateProject = async (req,res)=>{

    try {
        const {name,domain , description} = req.body

        if(!name || !domain || !description) return res.status(404).json({success: false, error:"provide complete details"})

        const userId = req.user._id

        const apiKey = crypto.randomBytes(16).toString('hex')

        const project = new ProjectModel({
            name,
            user:userId,
            apiKey,
            url:domain,
            description
        })

       const newProject =  await project.save()

       const user = await UserModel.findByIdAndUpdate(userId,{$addToSet:{projects:newProject._id}},{new:true})

      return  res.status(201).json({
        message: 'Project created successfully',
        newProject
      });

    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Server error at creating project' });
    }
}


export const fetchAllProject = async (req,res)=>{

    try {
        
        const userId = req.user._id

        const projects = await ProjectModel.find({ user: userId }).lean()

        if(!projects) return res.status(404).json({success: false, error:"no projects found."})

            const projectsWithEventCounts = await Promise.all(

                projects.map(async (project) => {
                  const eventCount = await EventModel.countDocuments({ project: project._id });
                  return {
                    ...project,
                    eventCount,
                  };
                })
              );

             return res.status(201).json({
                message: 'All Project Details',
                projectsWithEventCounts
              });


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server eror',error });
    }


}

export const fetchProjectID = async (req,res)=>{

    try {
        const userId = req.user._id

         const { id } = req.params;

         if(!id || !userId) return res.status(404).json({success: false, error:"no id provided."})

            
        const project = await ProjectModel.findById(id).lean()

        if(!project) return res.status(404).json({success: false, error:"no project found."})

            const events = await EventModel.find({ project: id }).lean();

            return  res.status(201).json({
                message: 'Project Details',
                project,events
              });

        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server eror',error });
    }
    
}


export const DeleteProject = async (req,res)=>{

    try {
        
        const userId = req.user._id

        const { id } = req.params;

        if(!id || !userId) return res.status(404).json({success: false, error:"no id provided."})

       const deletedProject =  await ProjectModel.findByIdAndDelete(id)

       if (!deletedProject) {
        return res.status(404).json({ message: 'Project not found' });
      }

      await UserModel.updateMany(
        { projects: id },
        { $pull: { projects: id } }
      );

      await EventModel.deleteMany({ project: id });

      return res.status(202).json({success:true,message:"Deleted succesfully"})
        


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server eror',error });
    }

}

export const RegenerateApiKey = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.body;

    if (!id || !userId) {
      return res.status(400).json({ success: false, error: 'Missing project ID or user not authenticated' });
    }

    const project = await ProjectModel.findOne({ _id: id, user: userId });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found or not authorized' });
    }

    const newApiKey = crypto.randomBytes(16).toString('hex');
    project.apiKey = newApiKey;
    await project.save();

    return res.status(200).json({
      success: true,
      message: 'API key regenerated successfully',
      apiKey: newApiKey
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Server error while regenerating API key' });
  }
};
