import React from 'react';
import { MOCK_TASKS, MOCK_METRICS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { GitBranchIcon, CheckCircleIcon, AlertCircleIcon, ActivityIcon, PlusIcon } from './Icons';
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// Simple mock data for chart
const CHART_DATA = [
  { name: 'Mon', tasks: 12 },
  { name: 'Tue', tasks: 19 },
  { name: 'Wed', tasks: 8 },
  { name: 'Thu', tasks: 24 },
  { name: 'Fri', tasks: 18 },
  { name: 'Sat', tasks: 4 },
  { name: 'Sun', tasks: 2 },
];

interface DashboardProps {
  onCreateTask?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateTask }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Workspace Overview</h1>
          <p className="text-slate-400 mt-1">Project: <span className="text-indigo-400 font-mono">master-coda-v1</span></p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="secondary" icon={<GitBranchIcon size={16} />}>feature/ui-refresh</Button>
          <Button variant="secondary" icon={<PlusIcon size={16} />} onClick={onCreateTask}>New Task</Button>
          <Button variant="primary" icon={<ActivityIcon size={16} />}>Deploy Staging</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_METRICS.map((metric, idx) => (
          <div key={idx} className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm relative overflow-hidden group hover:border-slate-600 transition-all">
            <div className={`absolute top-0 right-0 w-16 h-16 bg-${metric.color}-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`} />
            <p className="text-sm text-slate-400 font-medium">{metric.label}</p>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{metric.value}</span>
              {metric.change && (
                <span className={`text-xs font-medium ${
                  metric.trend === 'up' ? 'text-emerald-400' : 
                  metric.trend === 'down' ? 'text-red-400' : 'text-slate-500'
                }`}>
                  {metric.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-slate-200">Active Tasks</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-sm">
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-850 text-slate-400 font-medium border-b border-slate-700">
                 <tr>
                   <th className="px-6 py-3">ID</th>
                   <th className="px-6 py-3">Title</th>
                   <th className="px-6 py-3">Status</th>
                   <th className="px-6 py-3 text-right">Updated</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-700/50">
                 {MOCK_TASKS.map((task) => (
                   <tr key={task.id} className="hover:bg-slate-700/30 transition-colors group cursor-pointer">
                     <td className="px-6 py-3 font-mono text-slate-500 group-hover:text-indigo-400 transition-colors">{task.id}</td>
                     <td className="px-6 py-3 text-slate-200 font-medium">{task.title}</td>
                     <td className="px-6 py-3">
                       <Badge variant={
                         task.status === 'completed' ? 'success' : 
                         task.status === 'in-progress' ? 'info' :
                         task.status === 'failed' ? 'error' : 'neutral'
                       }>
                         {task.status}
                       </Badge>
                     </td>
                     <td className="px-6 py-3 text-right text-slate-500 font-mono text-xs">{task.updatedAt}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>

        {/* Right Col: Velocity & System */}
        <div className="space-y-6">
           <div>
            <h2 className="text-lg font-medium text-slate-200 mb-4">Sprint Velocity</h2>
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 h-64 shadow-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHART_DATA}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#334155', opacity: 0.2}} 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                  />
                  <Bar dataKey="tasks" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
           </div>

           <div>
             <h2 className="text-lg font-medium text-slate-200 mb-4">System Health</h2>
             <div className="space-y-3">
               <SystemCheckItem label="API Gateway" status="healthy" />
               <SystemCheckItem label="Database Cluster" status="healthy" />
               <SystemCheckItem label="Redis Cache" status="warning" message="High Memory Usage" />
               <SystemCheckItem label="CDN Edge" status="healthy" />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};

const SystemCheckItem: React.FC<{ label: string; status: 'healthy' | 'warning' | 'error'; message?: string }> = ({ label, status, message }) => (
  <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
    <div className="flex items-center">
      {status === 'healthy' && <CheckCircleIcon size={18} className="text-emerald-500 mr-3" />}
      {status === 'warning' && <AlertCircleIcon size={18} className="text-amber-500 mr-3" />}
      {status === 'error' && <AlertCircleIcon size={18} className="text-red-500 mr-3" />}
      <span className="text-slate-300 font-medium">{label}</span>
    </div>
    {message && <span className="text-xs text-amber-500 font-medium">{message}</span>}
  </div>
);

export default Dashboard;