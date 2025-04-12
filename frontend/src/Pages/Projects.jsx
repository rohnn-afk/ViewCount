import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../assets/ProjectCard';
import { ProjectStore } from '../Store/ProjectStore';
import ThemeToggle from '../assets/ThemeToggle';
import { useState } from 'react';
import AddProjectModal from '../Components/NewProjectModal';

const Projects = () => {
  const { projects, loading, fetchProjects } = ProjectStore();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
      fetchProjects()
    }, [fetchProjects])
    
  

  return (
    <div className="min-h-screen w-full flex justify-end bg-zinc-50 dark:bg-[#080d19] transition-colors">
      <div className="w-full sm:pl-52 pl-40 pr-6">
        {/* Theme Toggle */}
        <div className="fixed right-4 bottom-4 z-50">
        <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow-xl">
          <ThemeToggle />
        </div>
      </div>

        <div className="px-2 mx-auto py-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 px-4">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
          <span>📁 Your Projects</span>
              
            </h1>
            <button
            onClick={() => setShowModal(true)}
            className="bg-black dark:bg-white dark:text-black text-white px-4 py-2 rounded-xl text-sm hover:opacity-90 transition">
              + New Project
            </button>
          </div>
            <AddProjectModal
                    isOpen={showModal}
                    setIsOpen={setShowModal}
                  />

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center mt-[10rem]">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm">
              <svg className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Loading projects...</span>
            </div>
          </div>
          ) : projects?.length === 0 ? (
            <div className="text-zinc-500 text-sm mt-8 px-2">You haven't created any projects yet.</div>
          ) : (
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max gap-6 h-[84vh] overflow-y-auto p-4 hide-scrollbar pb-8">
              <AnimatePresence>
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
