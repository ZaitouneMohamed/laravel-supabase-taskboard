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
  Zap
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

const TaskDashboard = () => {
  // Sample task data - replace with actual API calls later
  const taskStats = [
    {
      title: 'Completed Tasks',
      value: '247',
      change: '+12.5%',
      trend: 'up',
      icon: CheckCircle,
      color: 'emerald',
      description: 'This month'
    },
    {
      title: 'In Progress',
      value: '18',
      change: '-2.3%',
      trend: 'down',
      icon: Clock,
      color: 'blue',
      description: 'Active tasks'
    },
    {
      title: 'Overdue',
      value: '7',
      change: '+25%',
      trend: 'up',
      icon: AlertTriangle,
      color: 'red',
      description: 'Need attention'
    },
    {
      title: 'Team Members',
      value: '12',
      change: '+8.3%',
      trend: 'up',
      icon: Users,
      color: 'purple',
      description: 'Active contributors'
    }
  ];

  const taskCompletionData = [
    { week: 'Week 1', completed: 45, created: 52 },
    { week: 'Week 2', completed: 38, created: 41 },
    { week: 'Week 3', completed: 52, created: 48 },
    { week: 'Week 4', completed: 61, created: 55 },
    { week: 'Week 5', completed: 49, created: 44 },
    { week: 'Week 6', completed: 58, created: 62 },
    { week: 'Week 7', completed: 67, created: 59 }
  ];

  const tasksByStatus = [
    { name: 'Completed', value: 247, color: '#10B981' },
    { name: 'In Progress', value: 18, color: '#3B82F6' },
    { name: 'To Do', value: 32, color: '#F59E0B' },
    { name: 'Review', value: 14, color: '#8B5CF6' },
    { name: 'Overdue', value: 7, color: '#EF4444' }
  ];

  const productivityData = [
    { day: 'Mon', tasksCompleted: 12, timeSpent: 6.5 },
    { day: 'Tue', tasksCompleted: 15, timeSpent: 7.2 },
    { day: 'Wed', tasksCompleted: 18, timeSpent: 8.1 },
    { day: 'Thu', tasksCompleted: 14, timeSpent: 6.8 },
    { day: 'Fri', tasksCompleted: 16, timeSpent: 7.5 },
    { day: 'Sat', tasksCompleted: 8, timeSpent: 4.2 },
    { day: 'Sun', tasksCompleted: 5, timeSpent: 2.8 }
  ];

  const recentTasks = [
    {
      id: 1,
      title: 'Update user authentication system',
      assignee: 'John Doe',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2024-03-25',
      progress: 75
    },
    {
      id: 2,
      title: 'Design new landing page',
      assignee: 'Sarah Smith',
      priority: 'Medium',
      status: 'Review',
      dueDate: '2024-03-23',
      progress: 90
    },
    {
      id: 3,
      title: 'Fix payment gateway bug',
      assignee: 'Mike Johnson',
      priority: 'High',
      status: 'To Do',
      dueDate: '2024-03-22',
      progress: 0
    },
    {
      id: 4,
      title: 'Write API documentation',
      assignee: 'Emily Davis',
      priority: 'Low',
      status: 'Completed',
      dueDate: '2024-03-20',
      progress: 100
    }
  ];

  const topPerformers = [
    { name: 'Sarah Smith', tasksCompleted: 23, avatar: '👩‍💻' },
    { name: 'John Doe', tasksCompleted: 19, avatar: '👨‍💼' },
    { name: 'Mike Johnson', tasksCompleted: 17, avatar: '👨‍💻' },
    { name: 'Emily Davis', tasksCompleted: 15, avatar: '👩‍🎨' }
  ];

  const StatCard = ({ stat }) => {
    const IconComponent = stat.icon;
    const isPositive = stat.trend === 'up';

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
              <IconComponent className={`h-6 w-6 text-${stat.color}-600`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center space-x-1 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span className="text-sm font-medium">{stat.change}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const TaskItem = ({ task }) => {
    const priorityColors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    };

    const statusColors = {
      'To Do': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Review': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800'
    };

    return (
      <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 mb-2">Assigned to {task.assignee}</p>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
              {task.status}
            </span>
          </div>
        </div>
        <div className="text-right ml-4">
          <p className="text-sm text-gray-600 mb-2">Due: {task.dueDate}</p>
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
                <p className="text-gray-600">Track your team's productivity and task progress</p>
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
                    <Area type="monotone" dataKey="completed" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="created" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
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
                    <Line type="monotone" dataKey="tasksCompleted" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6' }} />
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

export default TaskDashboard;
