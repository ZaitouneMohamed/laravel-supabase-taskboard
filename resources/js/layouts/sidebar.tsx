import React, { useState } from 'react';
import {
  Home,
  Users,
  Briefcase,
  Calendar,
  Settings,
  HelpCircle,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

const SidebarLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'lg:w-64 w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 ease-in-out fixed lg:relative z-30 h-full`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className={`flex items-center ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="h-8 w-8 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold">
              TB
            </div>
            {sidebarOpen && <span className="ml-3 font-medium text-xl">TaskBoard</span>}
          </div>

          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white lg:block hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="py-4">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActiveLink(link.id)}
              className={`flex items-center w-full px-4 py-3 transition-colors ${
                activeLink === link.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              } ${!sidebarOpen && 'justify-center'}`}
            >
              <link.icon size={20} />
              {sidebarOpen && <span className="ml-4">{link.label}</span>}
            </button>
          ))}
        </div>

        {/* User section at bottom */}
        {sidebarOpen && (
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-600 overflow-hidden">
                <img
                  src="/api/placeholder/40/40"
                  alt="User profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Alex Morgan</p>
                <p className="text-xs text-gray-400">alex@company.com</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-20">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 hover:text-gray-900 lg:hidden mr-4"
              >
                <Menu size={24} />
              </button>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search size={18} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative text-gray-600 hover:text-gray-900">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src="/api/placeholder/40/40"
                    alt="User profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button className="ml-2 flex items-center text-gray-700 hover:text-gray-900">
                  <span className="mr-1 hidden md:block">Alex Morgan</span>
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Content cards */}
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-lg font-medium text-gray-900">Card Title {item}</h2>
                  <p className="mt-2 text-gray-600">
                    This is a sample card with some content. You can replace this with your actual content.
                  </p>
                </div>
              ))}
            </div>

            {/* Table example */}
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Tasks</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[
                      { task: 'Design new landing page', status: 'In Progress', assignee: 'Alex Morgan', dueDate: 'May 10, 2025' },
                      { task: 'Update user authentication', status: 'Completed', assignee: 'Jordan Lee', dueDate: 'May 5, 2025' },
                      { task: 'Optimize database queries', status: 'To Do', assignee: 'Casey Taylor', dueDate: 'May 15, 2025' },
                    ].map((task, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {task.task}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.assignee}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.dueDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
