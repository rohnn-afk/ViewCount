import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import { axiosInstance } from "../lib/Axios";
import AnimatedBox from "../assets/AnimatedBox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ProjectStore } from "../Store/ProjectStore";

export default function AddProjectModal({ isOpen, setIsOpen }) {

    const { fetchProjects } = ProjectStore();

    const navigate = useNavigate()

  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [domainError, setDomainError] = useState("");

  const validateDomain = (value) => {
    const domainRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    return domainRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate domain
    if (!validateDomain(domain)) {
      setDomainError("Please enter a valid domain like mysite.com");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/project/create", {
        name,
        domain,
        description,
      });
      toast.success("New Project created successfully 👾🎉");
      navigate('/projects')
      setIsOpen(false);
      fetchProjects()
    } catch (err) {
      console.error("Failed to add project:", err);
      toast.error("Something went wrong while adding the project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center">
        <AnimatedBox className="sm:w-[35rem] w-[25rem] text-lg flex items-center justify-center bg-black dark:bg-white text-gray-800">
          <Dialog.Panel className="bg-white dark:bg-zinc-950 p-6 rounded-2xl sm:w-[35rem] w-[25rem]">
            <div className="flex justify-between items-center mb-7">
              <Dialog.Title className="text-lg font-semibold dark:text-white">
                Add New Project
              </Dialog.Title>
              <button onClick={() => setIsOpen(false)}>
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-3">
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-zinc-800 mb-3 dark:border-zinc-700 dark:text-white"
                  placeholder="e.g. My Portfolio"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-3">
                  Domain
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDomain(value);
                    setDomainError(
                      value === "" || validateDomain(value)
                        ? ""
                        : "Please enter a valid domain like mysite.com"
                    );
                  }}
                  className={`w-full px-4 py-2 border rounded-xl mb-1
                    ${domainError ? "border-red-500" : "border-gray-300 dark:border-zinc-700"}
                    dark:bg-zinc-800 dark:text-white`}
                  placeholder="e.g. mysite.com"
                />
                {domainError && (
                  <p className="text-sm text-red-500 mt-1">{domainError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-3">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-zinc-800 mb-6 dark:border-zinc-700 dark:text-white"
                  placeholder="website description"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
              >
                {loading ? "Adding..." : "Add Project"}
              </button>
            </form>
          </Dialog.Panel>
        </AnimatedBox>
      </div>
    </Dialog>
  );
}
