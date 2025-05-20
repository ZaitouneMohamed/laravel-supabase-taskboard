// resources/js/Pages/Boards/Create.jsx
import React, { useState, useEffect } from 'react';
import { usePage, useForm, Link } from '@inertiajs/react';
import { ChevronLeft, Loader2, X, Settings, Users, Eye, EyeOff } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { motion, AnimatePresence } from 'framer-motion'; // Added framer-motion for animations

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Boards',
    href: '/boards',
  },
  {
    title: 'Create',
    href: '/boards/create',
    current: true,
  },
];

// Fade in animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

// Staggered children animation
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Create() {
  const { boardTypes, teams } = usePage().props;
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const { data, setData, errors, post, processing, reset } = useForm({
    name: '',
    description: '',
    status: 'active',
    type_id: '',
    team_id: '',
    is_private: false,
    settings: {
      enable_voting: true,
      allow_comments: true,
      show_creator: true,
    },
    template_id: null,
  });

  function handleSubmit(e) {
    e.preventDefault();
    post(route('board.store'), {
      onSuccess: () => reset(),
    });
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/boards"
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <motion.div whileHover={{ x: -3 }} transition={{ duration: 0.2 }}>
              <ChevronLeft className="w-4 h-4" />
            </motion.div>
            <span>Back to Boards</span>
          </Link>
        </div>

        <motion.div
          className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Create New Board</h1>
            <p className="text-sm text-gray-500 mt-1">
              Set up a new board to collaborate with your team
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Board Name */}
              <motion.div variants={fadeIn}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Board Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={data.name}
                  onChange={e => setData('name', e.target.value)}
                  className={`w-full rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-transparent focus:ring-2 transition-all duration-200 shadow-sm`}
                  placeholder="My Awesome Board"
                />
                <AnimatePresence>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Board Description */}
              <motion.div variants={fadeIn}>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  rows={3}
                  className={`w-full rounded-lg border ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-transparent focus:ring-2 transition-all duration-200 shadow-sm`}
                  placeholder="What is this board for?"
                />
                <AnimatePresence>
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-1 text-sm text-red-600"
                    >
                      {errors.description}
                    </motion.p>
                  )}
                </AnimatePresence>
                <p className="mt-1 text-xs text-gray-500">
                  A clear description helps team members understand the purpose of this board
                </p>
              </motion.div>

              {/* Board Type and Team */}
              <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="type_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Board Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="type_id"
                    value={data.type_id}
                    onChange={e => setData('type_id', e.target.value)}
                    className={`w-full rounded-lg border ${errors.type_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-transparent focus:ring-2 transition-all duration-200 shadow-sm`}
                  >
                    <option value="">Select a type</option>
                    {boardTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <AnimatePresence>
                    {errors.type_id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.type_id}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div>
                  <label htmlFor="team_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Team
                  </label>
                  <div className="relative">
                    <select
                      id="team_id"
                      value={data.team_id}
                      onChange={e => setData('team_id', e.target.value)}
                      className={`w-full rounded-lg border ${errors.team_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} focus:border-transparent focus:ring-2 transition-all duration-200 shadow-sm pl-10`}
                    >
                      <option value="">Personal Board</option>
                      {teams.map(team => (
                        <option key={team.id} value={team.id}>{team.name}</option>
                      ))}
                    </select>
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  <AnimatePresence>
                    {errors.team_id && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-1 text-sm text-red-600"
                      >
                        {errors.team_id}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Visibility and Status */}
              <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={data.status}
                    onChange={e => setData('status', e.target.value)}
                    className="w-full rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-transparent focus:ring-2 transition-all duration-200 shadow-sm"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <div className="relative h-5 flex items-center mt-6">
                    <motion.div
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <input
                        id="is_private"
                        type="checkbox"
                        checked={data.is_private}
                        onChange={e => setData('is_private', e.target.checked)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </motion.div>
                  </div>
                  <div className="ml-3">
                    <label htmlFor="is_private" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      Private Board
                      {data.is_private ?
                        <EyeOff className="w-4 h-4 ml-2 text-gray-500" /> :
                        <Eye className="w-4 h-4 ml-2 text-gray-500" />
                      }
                    </label>
                    <p className="text-xs text-gray-500">
                      Only you and invited members can access private boards
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Board Settings */}
              <motion.div variants={fadeIn}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">Board Settings</h3>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    {showSettings ? 'Hide Settings' : 'Show Settings'}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 bg-gray-50 p-4 rounded-lg overflow-hidden"
                    >
                      <motion.div
                        className="flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="h-5 flex items-center">
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <input
                              id="enable_voting"
                              type="checkbox"
                              checked={data.settings.enable_voting}
                              onChange={e => setData('settings', {
                                ...data.settings,
                                enable_voting: e.target.checked
                              })}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </motion.div>
                        </div>
                        <div className="ml-3">
                          <label htmlFor="enable_voting" className="text-sm font-medium text-gray-700">
                            Enable voting
                          </label>
                          <p className="text-xs text-gray-500">
                            Allow members to vote on items
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="h-5 flex items-center">
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <input
                              id="allow_comments"
                              type="checkbox"
                              checked={data.settings.allow_comments}
                              onChange={e => setData('settings', {
                                ...data.settings,
                                allow_comments: e.target.checked
                              })}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </motion.div>
                        </div>
                        <div className="ml-3">
                          <label htmlFor="allow_comments" className="text-sm font-medium text-gray-700">
                            Allow comments
                          </label>
                          <p className="text-xs text-gray-500">
                            Enable commenting on board items
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        className="flex items-start"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="h-5 flex items-center">
                          <motion.div whileTap={{ scale: 0.9 }}>
                            <input
                              id="show_creator"
                              type="checkbox"
                              checked={data.settings.show_creator}
                              onChange={e => setData('settings', {
                                ...data.settings,
                                show_creator: e.target.checked
                              })}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </motion.div>
                        </div>
                        <div className="ml-3">
                          <label htmlFor="show_creator" className="text-sm font-medium text-gray-700">
                            Show creator
                          </label>
                          <p className="text-xs text-gray-500">
                            Display the creator's name on board items
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!showSettings && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-gray-500 italic"
                  >
                    Click on "Show Settings" to configure board behavior
                  </motion.div>
                )}
              </motion.div>

              {/* Templates */}
              <motion.div variants={fadeIn}>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Start with a Template (Optional)</h3>
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {[
                    { id: 'blank', name: 'Blank Board', description: 'Start from scratch' },
                    { id: 'roadmap', name: 'Product Roadmap', description: 'Track features and releases' },
                    { id: 'retrospective', name: 'Team Retrospective', description: 'Collect team feedback' }
                  ].map(template => (
                    <motion.div
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setData('template_id', template.id === 'blank' ? null : template.id);
                      }}
                      className={`cursor-pointer border rounded-lg p-4 transition-all duration-200 transform ${
                        selectedTemplate === template.id
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500 ring-opacity-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                      }`}
                      variants={fadeIn}
                      whileHover={{
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Form Actions */}
            <motion.div
              className="flex justify-end space-x-3 pt-4 border-t border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/boards"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200 inline-block"
                >
                  Cancel
                </Link>
              </motion.div>
              <motion.button
                type="submit"
                disabled={processing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Board'
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
