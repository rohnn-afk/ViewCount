import { ArrowUpRight, Eye, CalendarDays, Users, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectStore } from "../Store/ProjectStore";

export default function ProjectCard({ project }) {

    const {deleteProject} = ProjectStore()

  const navigate = useNavigate();
  const createdAt = new Date(project?.createdAt);
  const daysAgo = Math.floor((new Date() - createdAt) / (1000 * 60 * 60 * 24));

  return (
    <button
      onClick={() => navigate(`/projects/${project._id}`)}
      className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:border-blue-500 hover:border-blue-500 hover:bg-blue-50  hover:scale-[1.03] transition-all p-5 flex flex-col justify-between text-left w-full group"
    >
      {/* Delete button */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          deleteProject(project._id,project.name)
        }}
        title="Delete Project"
        className="absolute top-3 right-3 p-1.5 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-1">{project.name}</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2 line-clamp-2">
          {project?.description || "No description provided."}
        </p>
        <a
          href={project.url}
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          target="_blank"
          rel="noreferrer"
        >
          {project.url}
          <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <div className="mt-5 flex flex-col gap-2 text-[13px] text-zinc-600 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-blue-500" />
          <span>
            <strong className="text-zinc-900 dark:text-white">{project?.eventCount || 0}</strong> views
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} className="text-emerald-500" />
          <span>
            <strong className="text-zinc-900 dark:text-white">{project?.uniqueVisitors.length || 0}</strong> unique visitors
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays size={16} className="text-violet-500" />
          <span>
            <span className="text-zinc-900 dark:text-white">{createdAt.toLocaleDateString()}</span>
            &nbsp;(<span className="italic">{daysAgo} day{daysAgo !== 1 ? "s" : ""} ago</span>)
          </span>
        </div>
      </div>
    </button>
  );
}
