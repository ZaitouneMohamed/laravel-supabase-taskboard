import { Head } from '@inertiajs/react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  BarChart3,
  Target,
  Zap,
  Plus
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { useState } from 'react';
import { Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';

interface TaskStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  description: string;
}

interface TaskCompletionData {
  week: string;
  completed: number;
  created: number;
}

interface TaskByStatus {
  name: string;
  value: number;
  color: string;
}

interface ProductivityData {
  day: string;
  tasksCompleted: number;
  timeSpent: number;
}

interface RecentTask {
  id: number;
  title: string;
  assignee: string;
  priority: string;
  status: string;
  dueDate: string | null;
  progress: number;
}

interface TopPerformer {
  name: string;
  tasksCompleted: number;
  avatar: string;
}

interface DashboardProps {
  taskStats: TaskStat[];
  taskCompletionData: TaskCompletionData[];
  tasksByStatus: TaskByStatus[];
  productivityData: ProductivityData[];
  recentTasks: RecentTask[];
  topPerformers: TopPerformer[];
}

const Dashboard = ({
  taskStats = [],
  taskCompletionData = [],
  tasksByStatus = [],
  productivityData = [],
  recentTasks = [],
  topPerformers = []
}: Partial<DashboardProps>) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({
    title: '',
    priority: 'Medium',
    status: 'todo'
  });

  const handleCreateClick = () => {
    router.get(route('boards.items.create'));
  };

  // Add debugging log
  console.log('Dashboard Props:', {
    taskStats,
    taskCompletionData,
    tasksByStatus,
    productivityData,
    recentTasks,
    topPerformers
  });

  // Early return if no data is available
  if (!Array.isArray(taskStats) || taskStats.length === 0) {
    return (
      <>
        <Head title="Task Dashboard" />
        <AppLayout>
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
                <p className="text-gray-600">Loading dashboard data...</p>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">Debug Information:</p>
                  <pre className="mt-2 text-xs text-yellow-700 overflow-auto">
                    {JSON.stringify({
                      taskStatsType: typeof taskStats,
                      taskStatsValue: taskStats,
                      taskStatsIsArray: Array.isArray(taskStats),
                      taskStatsLength: Array.isArray(taskStats) ? taskStats.length : 'N/A',
                      allProps: {
                        taskCompletionData: Array.isArray(taskCompletionData) ? taskCompletionData.length : 'not array',
                        tasksByStatus: Array.isArray(tasksByStatus) ? tasksByStatus.length : 'not array',
                        productivityData: Array.isArray(productivityData) ? productivityData.length : 'not array',
                        recentTasks: Array.isArray(recentTasks) ? recentTasks.length : 'not array',
                        topPerformers: Array.isArray(topPerformers) ? topPerformers.length : 'not array',
                      }
                    }, null, 2)}
                  </pre>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                    <div className="h-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </AppLayout>
      </>
    );
  }

  const StatCard = ({ stat }: { stat: TaskStat }) => {
    const IconComponent = {
      'Completed Tasks': CheckCircle,
      'In Progress': Clock,
      'Overdue': AlertTriangle,
      'Team Members': Users
    }[stat.title] || Activity;

    const colorClasses = {
      emerald: 'bg-emerald-100 text-emerald-600',
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600'
    };

    const colorClass = colorClasses[stat.color as keyof typeof colorClasses] || 'bg-gray-100 text-gray-600';

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg ${colorClass.split(' ')[0]}`}>
              <IconComponent className={`h-6 w-6 ${colorClass.split(' ')[1]}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-1 ${
              stat.trend === 'up' ? 'text-emerald-600' :
              stat.trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {stat.trend === 'up' ? <ArrowUpRight className="h-4 w-4" /> :
               stat.trend === 'down' ? <ArrowDownRight className="h-4 w-4" /> :
               <TrendingUp className="h-4 w-4" />}
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const TaskItem = ({ task }: { task: RecentTask }) => {
    const priorityColors: Record<string, string> = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    };

    const statusColors: Record<string, string> = {
      'todo': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'review': 'bg-purple-100 text-purple-800',
      'done': 'bg-green-100 text-green-800'
    };

    return (
      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 mb-2">Assigned to {task.assignee}</p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority] || priorityColors.Medium}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || statusColors.todo}`}>
              {task.status}
            </span>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-sm text-gray-600 mb-2">Due: {task.dueDate || 'No date'}</p>
          <div className="w-20 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{task.progress}%</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head title="Task Dashboard" />

      <AppLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header with Create Button */}
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
                <p className="text-gray-600">Track your team's productivity and task progress</p>
              </div>
              <button
                onClick={handleCreateClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Item
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {taskStats.map((stat, index) => (
                <StatCard key={index} stat={stat} />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Task Completion Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Task Completion Trend</h3>
                  <BarChart3 className="h-5 w-5 text-gray-400" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={taskCompletionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="created"
                      stackId="2"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Tasks by Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Tasks by Status</h3>
                  <Target className="h-5 w-5 text-gray-400" />
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={tasksByStatus}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {tasksByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Productivity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Weekly Productivity</h3>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={productivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tasksCompleted"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Tasks */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
                  ))}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
                  <Zap className="h-5 w-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{performer.avatar}</div>
                        <div>
                          <p className="font-medium text-gray-900">{performer.name}</p>
                          <p className="text-sm text-gray-600">{performer.tasksCompleted} tasks completed</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
};

export default Dashboard;
