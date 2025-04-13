import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { SettingStore } from '../Store/SettingStore';
import { Copy, RefreshCw, Save, X } from 'lucide-react';
import ThemeToggle from '../assets/ThemeToggle';

const SettingsPage = () => {

  const { fetchuserdata, user, loading ,handleRegenerate , updateUser , resetProject ,SetResetModal , ResetModal} = SettingStore();
  const [copiedKeyId, setCopiedKeyId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [ProjectID,SetProjectID]= useState({projectName:null,id:null})

  useEffect(() => {
    fetchuserdata();
  }, [fetchuserdata]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const handleCopy = (apiKey, projectId) => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKeyId(projectId);
    toast.success('API Key copied to clipboard');
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await updateUser(formData); // send name, email, and password
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading || !user) {
    return ( <div className="flex items-center justify-center w-full h-screen bg-white pl-40 dark:bg-zinc-900">
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm">
        <svg className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Loading projects...</span>
      </div>
    </div>)    
  }

  return (
    <div className='w-full sm:pl-52 pl-40 relative'>

      {
        ResetModal 
        
        && 
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white dark:bg-[#0d121c] rounded-2xl shadow-2xl w-full max-w-md p-8 transition-all duration-300 scale-100">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Confirm Reset
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            This action is irreversible. It will permanently delete all event data and reset the stats for:
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white text-sm px-4 py-2 rounded-md mb-6 font-medium">
            Project: {ProjectID.name}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => SetResetModal(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              onClick={() => resetProject(ProjectID.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
            >
              Yes, Reset
            </button>
          </div>
        </div>
      </div>
      
      }
      <div className='h-screen w-full bg-white text-black dark:bg-black dark:text-white px-6 sm:px-12 py-6 hide-scrollbar overflow-y-auto'>
       

       
       <div className="fixed right-4 bottom-4 z-50">
              <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow-xl">
                <ThemeToggle />
              </div>
            </div>
      {/* User Profile Section */}
      <section className="mb-12">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            {editMode ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
                  placeholder="Name"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
                  placeholder="Email"
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm"
                  placeholder="New Password"
                />
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
                >
                  <Save size={16} /> Save Changes
                </button>
                <button
  onClick={() => setEditMode(false)}
  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-300 shadow-sm"
>
  <X size={16} /> Cancel
</button>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
                <button
                  onClick={() => setEditMode(true)}
                  className="mt-3 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">📁 Your Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {user.projects.map((project) => (
            <div
              key={project._id}
              className="rounded-2xl p-6 border bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{project.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{project.description}</p>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {project.url}
                  </a>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(project.createdAt).toLocaleDateString()}
                  <div className="relative group inline-block m-4">
  <button 
  onClick={()=>{SetProjectID({name:project.name,id:project._id});SetResetModal(true)}}
  className="text-red-500">
    Reset
  </button>
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-sm px-3 py-1 rounded-md shadow-lg whitespace-nowrap z-10">
    Deletes all previous event data and resets project stats
  </div>
</div>
                </span>
              </div>

              <div className="mt-5">
                <label className="text-gray-600 dark:text-gray-400 text-sm">API Key</label>
                <div className="flex items-center mt-2 gap-2">
                  <input
                    type="text"
                    value={project.apiKey}
                    disabled
                    className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 font-mono"
                  />
                  <button
                    onClick={() => handleCopy(project.apiKey, project._id)}
                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    title="Copy API Key"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleRegenerate(project._id)}
                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    title="Regenerate API Key"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
                {copiedKeyId === project._id && (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">✅ Copied!</p>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Unique Visitors: <span className="font-medium text-gray-700 dark:text-gray-200">{project.uniqueVisitors.length}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </div>

  );
};

export default SettingsPage;
