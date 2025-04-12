import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ProjectStore } from '../Store/ProjectStore'
import {
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, CartesianGrid
} from 'recharts'
import toast from 'react-hot-toast'
import { ClipboardCopy, ArrowLeft, Globe, Users, CalendarDays, Eye, FileBarChart2, BarChart4, Clock, Link, Sun, Moon, ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import ThemeToggle from '../assets/ThemeToggle'


const COLORS = ['#4F46E5', '#06B6D4', '#22C55E', '#FACC15', '#F43F5E', '#94A3B8'];


const renderCustomizedLabel = () => ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.2;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);


  return (
    <text x={x} y={y} fill='#B0B0B0' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
}



const ProjectID = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { fetchprojectbyID, loadingproject, projectData } = ProjectStore()

  const [selectedEventType, setSelectedEventType] = useState('pageview')
  const [viewers, setViewers] = useState([])

  useEffect(() => {
    fetchprojectbyID(id)
  }, [fetchprojectbyID, id])

  useEffect(() => {
    if (projectData?.events) {
      const filtered = projectData.events.filter(e => e.eventType === selectedEventType);
      setViewers(
        filtered.map(e => ({
          visitorId: e.visitorId || 'Unknown',
          timestamp: new Date(e.timestamp).toLocaleString() 
        }))
      );
    }
  }, [projectData, selectedEventType]);

  const getEventTypeCounts = () => {
    const map = {}
    projectData?.events?.forEach(e => {
      map[e.eventType] = (map[e.eventType] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }

  const getReferrerData = () => {
    const map = {}
    projectData?.events?.forEach(e => {
      const ref = new URL(e.referrer || 'https://direct.com')
      const domain = ref.hostname === 'direct.com' ? 'Direct' : ref.hostname.replace('www.', '')
      map[domain] = (map[domain] || 0) + 1
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }

  const getEventsOverTime = () => {
    const map = {}
    projectData?.events?.forEach(e => {
      const date = new Date(e.timestamp).toISOString().split("T")[0]
      map[date] = (map[date] || 0) + 1
    })
    return Object.entries(map).map(([date, value]) => ({ date, value })).sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getTopPages = () => {
    const map = {}
    projectData?.events?.forEach(e => {
      const url = e.url || 'Unknown'
      if (!map[url]) map[url] = { count: 0, lastSeen: e.timestamp }
      map[url].count++
      map[url].lastSeen = e.timestamp > map[url].lastSeen ? e.timestamp : map[url].lastSeen
    })
    return Object.entries(map).map(([url, info]) => ({ url, ...info }))
  }


  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded shadow text-sm text-white border border-gray-600">
          <p className="font-semibold text-teal-400">Date : {label}</p>
          <p className="mt-1">Total Events : <span className="text-green-400">{payload[0].value}</span></p>
        </div>
      )
    }
    return null
  }

  if (loadingproject) return ( <div className="flex w-full sm:pl-52 pl-40 items-center bg-white dark:bg-black h-screen justify-center">
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-sm">
      <svg className="animate-spin h-4 w-4 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">Loading project...</span>
    </div>
  </div>)

  return (
    <div className='w-full sm:pl-52 pl-40'>
      <div className='h-screen w-full bg-white text-black dark:bg-black dark:text-white px-6 sm:px-12 py-6 hide-scrollbar overflow-y-auto'>
      <div className="fixed right-4 bottom-4 z-50">
        <div className="bg-white dark:bg-zinc-800 p-2 rounded-full shadow-xl">
          <ThemeToggle />
        </div>
      </div>
        <div className='flex justify-between items-center mb-6'>
          <div>
          
          <h1 className='text-3xl font-bold mb-1 flex flex-col gap-6'>{projectData?.project?.name}   
          <a
          href={projectData?.project?.url}
          className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
          target="_blank"
          rel="noreferrer"
        >
          <h1 className='text-black dark:text-white mr-2'>URL : </h1>{projectData?.project?.url}
          <ArrowUpRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
        </a></h1>
            <p className='text-sm text-gray-600  dark:text-gray-400'>Created at: {new Date(projectData?.project?.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap gap-3">
  <button
    onClick={() => {
      navigator.clipboard.writeText(projectData?.project?.apiKey);
      toast.success('Copied API Key');
    }}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-xs tracking-wide transition-all duration-200 
               bg-neutral-900 dark:bg-white text-white dark:text-black 
               hover:opacity-90 shadow-md hover:shadow-lg"
  >
    <ClipboardCopy size={16} />
    Copy API Key
  </button>

  <button
    onClick={() => navigate('/projects')}
    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-medium tracking-wide transition-all duration-200 
               bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white 
               hover:opacity-90 shadow-md hover:shadow-lg text-sm"
  >
    <ArrowLeft size={16} />
    Back
  </button>
</div>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-16">
  <InfoCard label="Total Events" value={projectData?.events?.length || 0} icon={<Eye size={24} />} />
  <InfoCard
    label="Unique Pages Tracked"
    value={[...new Set((projectData?.events || []).map(e => e.url))].length}
    icon={<FileBarChart2 size={24} />}
  />
  <InfoCard
    label="Top Traffic Source"
    value={getReferrerData()?.[0]?.name || 'None'}
    icon={<Globe size={24} />}
  />
  <InfoCard
    label="Event Types"
    value={getEventTypeCounts().length}
    icon={<BarChart4 size={24} />}
  />
  <InfoCard
    label="Unique Visitors"
    value={[...new Set((projectData?.events || []).map(e => e.metadata?.visitorId))].length}
    icon={<Users size={24} />}
  />
  <InfoCard
    label="Latest Event Date"
    value={
      projectData?.events?.length
        ? new Date(Math.max(...projectData.events.map(e => new Date(e.timestamp)))).toLocaleDateString()
        : 'N/A'
    }
    icon={<CalendarDays size={24} />}
  />
</div>



       

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-16'>
          <ChartCard title="Event Type Distribution" data={getEventTypeCounts()} />
          <ChartCard title="Traffic Sources" data={getReferrerData()} />
        </div>

        <div className='bg-white dark:bg-gray-900 p-4 rounded-lg mb-16 shadow-md'>
          <h2 className='text-lg font-semibold mb-2'>Event Activity Over Time</h2>
          <ResponsiveContainer width='100%' height={300}>
            <LineChart data={getEventsOverTime()} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" tick={{ fill: "#999999", fontSize: 12 }} />
              <YAxis stroke="#ccc" tick={{ fill: "#999999", fontSize: 12 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="value" stroke="#00C49F" strokeWidth={3} dot={{ r: 4, stroke: '#00C49F', strokeWidth: 2, fill: '#1f2937' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className='bg-white shadow-md dark:bg-gray-900 p-4 rounded-lg mb-16'>
          <h2 className='text-lg font-semibold mb-4'>Most Visited Pages</h2>
          <table className='w-full text-left'>
            <thead>
              <tr>
                <th className='pb-3 pl-2'>Page URL</th>
                <th className='pb-3 text-center'>Visits</th>
                <th className='pb-3 text-right'>Last Seen</th>
              </tr>
            </thead>
            <tbody>
              {getTopPages().map((p, i) => (
                <tr key={i} className='border-t border-gray-300 dark:border-gray-700'>
                  <td className='py-2 break-all flex items-center space-x-4 gap-2'><Link size={10} /> <span>{p.url}</span></td>
                  <td className='py-2 text-center'>{p.count}</td>
                  <td className='py-2 text-right'><Clock size={14} className='inline-block mr-1' /> {new Date(p.lastSeen).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: 'easeInOut' }}
  className='mb-6'
>
  <div className='flex flex-wrap items-center gap-4  px-1 py-2 rounded-xl transition-all'>
    <label className='font-semibold text-sm text-gray-700 dark:text-gray-300'>
      Filter by Event Type:
    </label>
    <motion.select
      whileTap={{ scale: 0.98 }}
      value={selectedEventType}
      onChange={e => setSelectedEventType(e.target.value)}
      className='appearance-none bg-white dark:bg-gray-900 hover:cursor-pointer text-black dark:text-white px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm'
    >
      {[...new Set((projectData?.events || []).map(e => e.eventType))].map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </motion.select>
  </div>
</motion.div>


        <div className='bg-gray-100 dark:bg-gray-900 p-4 rounded-lg mb-20'>
          <h2 className='text-lg font-semibold mb-4'>Users who triggered <span className='font-bold '>"{selectedEventType}"</span></h2>
          <ul className='list-disc ml-6 text-gray-800 dark:text-gray-300'>
            {viewers.length > 0 ? viewers.map((v, i) => (
              <li key={i}className='py-1' ><div className='w-full flex flex-row items-center justify-between'> <h1>{v.visitorId}</h1> <h2>{v.timestamp} </h2> </div></li>
            )) : <li>No data available</li>}
          </ul>
        </div>
      </div>
    </div>
  )
}

const InfoCard = ({ label, value, icon }) => (
  <motion.div 
  key={label}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.2, delay: 0.5 }}
  className="bg-blue-50 dark:bg-gray-900 hover:dark:bg-gray-800 p-4 sm:p-5 rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow duration-300 w-full h-full">
    <div className="text-primary text-2xl">{icon}</div>
    <div className="flex flex-col justify-between w-full gap-1">
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white break-words">{value}</h2>
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-xl p-3 shadow-lg border text-sm space-y-2 bg-white text-black border-gray-200 dark:bg-blue-950 dark:text-white dark:border-zinc-700">
      <p className="font-semibold ">{payload[0].name}</p>
      <p className="opacity-80">Value: {payload[0].value}</p>
    </div>
  );
};

const ChartCard = ({ title, data }) => (
  <div className=' bg-white shadow-md dark:bg-gray-950 p-14 rounded-lg'>
    <h2 className='text-lg font-semibold mb-2'>{title}</h2>
    <ResponsiveContainer width='100%' height={250}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={renderCustomizedLabel()}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
)

export default ProjectID
