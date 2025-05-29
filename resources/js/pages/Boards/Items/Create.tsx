// resources/js/Pages/Boards/Items/Create.jsx
import React from 'react';
import { usePage, useForm, router } from '@inertiajs/react';
import {
  Save,
  X,
  AlertCircle,
  CalendarClock,
  ListTodo,
  Flag,
  User
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

interface Member {
  id: number;
  name: string;
}

interface Board {
  id: number;
  name: string;
  members?: Member[];
}

type PageProps = {
  board: {
    data: Board;
  };
  statuses: string[];
  priorities: string[];
  errors: Record<string, string>;
  [key: string]: string | number | null | undefined;
};

type FormData = {
  boardId: number | null;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  assignee_id: number | string;
  [key: string]: string | number | null | undefined;
};

export default function CreateBoardItem() {
  const props = usePage<PageProps>().props;
  const board = props.board;
  const statuses = props.statuses || [];
  const priorities = props.priorities || [];

  const { data, setData, post, processing, errors, reset } = useForm<FormData>({
    boardId: board?.data?.id || null,
    title: '',
    description: '',
    status: 'todo',
    priority: 'Medium',
    due_date: '',
    assignee_id: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('boards.items.store'), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        router.visit(route('dashboard'));
      },
    });
  };

  const getStatusOptions = (): string[] => {
    if (Array.isArray(statuses) && statuses.length > 0) {
      return statuses;
    }
    return ['todo', 'in-progress', 'done'];
  };

  const getPriorityStyles = (priority: string): string => {
    const styles: Record<string, string> = {
      'Low': 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      'Medium': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      'High': 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      'Urgent': 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    };
    return styles[priority] || styles['Medium'];
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 mr-2 bg-blue-100 rounded-full flex items-center justify-center">
                    <ListTodo className="w-4 h-4 text-blue-600" />
                  </div>
                  <h1 className="text-xl font-semibold text-gray-900">Add New Item</h1>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
                  onClick={() => router.visit(route('dashboard'))}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.title ? 'border-red-300 ring-1 ring-red-300' : ''
                    }`}
                    placeholder="What needs to be done?"
                    required
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                      errors.description ? 'border-red-300 ring-1 ring-red-300' : ''
                    }`}
                    placeholder="Add details about this task..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <ListTodo className="w-4 h-4 mr-1 text-gray-500" />
                      Status
                    </label>
                    <select
                      id="status"
                      value={data.status}
                      onChange={e => setData('status', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      {getStatusOptions().map((status: string) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <Flag className="w-4 h-4 mr-1 text-gray-500" />
                      Priority
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(priorities) ? priorities : ['Low', 'Medium', 'High', 'Urgent']).map((priority: string) => (
                        <button
                          key={priority}
                          type="button"
                          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                            data.priority.toLowerCase() === priority.toLowerCase()
                              ? `${getPriorityStyles(priority)} ring-2 ring-offset-1 ${
                                  priority.toLowerCase() === 'low' ? 'ring-green-500' :
                                  priority.toLowerCase() === 'medium' ? 'ring-blue-500' :
                                  priority.toLowerCase() === 'high' ? 'ring-orange-500' :
                                  'ring-red-500'
                                }`
                              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                          }`}
                          onClick={() => setData('priority', priority)}
                        >
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Due Date and Assignee */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Due Date */}
                  <div>
                    <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <CalendarClock className="w-4 h-4 mr-1 text-gray-500" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="due_date"
                      value={data.due_date}
                      onChange={e => setData('due_date', e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  {/* Assignee */}
                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <User className="w-4 h-4 mr-1 text-gray-500" />
                      Assign To
                    </label>
                    <select
                      id="assignee"
                      value={data.assignee_id}
                      onChange={e => setData('assignee_id', e.target.value ? parseInt(e.target.value, 10) : '')}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Unassigned</option>
                      {board?.data?.members?.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tips section */}
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <h3 className="text-xs font-medium text-blue-800 flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                    Tips
                  </h3>
                  <ul className="mt-1 text-xs text-blue-700 space-y-1 pl-4 list-disc">
                    <li>Use clear, specific titles</li>
                    <li>Include relevant details in the description</li>
                    <li>Set realistic due dates</li>
                  </ul>
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => router.visit(route('dashboard'))}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75 disabled:cursor-not-allowed"
                    disabled={processing}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {processing ? 'Saving...' : 'Save Item'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
