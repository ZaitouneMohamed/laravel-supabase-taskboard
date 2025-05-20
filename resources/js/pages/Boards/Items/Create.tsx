// resources/js/Pages/Boards/Items/Create.jsx
import React, { useState } from 'react';
import { usePage, useForm, Link } from '@inertiajs/react';
import {
  ChevronRight,
  Save,
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import AppLayout from '@/layouts/app-layout';

export default function CreateBoardItem() {
  // Get board data from props
  const { board, auth } = usePage().props;
  const newData = board.data;
  const [isStarred, setIsStarred] = useState(newData.is_starred);

  const { boardType, statuses, priorities } = usePage().props;

  // Initialize form with useForm
  const { data, setData, post, processing, errors } = useForm({
    boardId: newData.id,
    title: 'title here',
    description: 'description here',
    status: 'todo', // Default status
    priority: 'medium', // Default priority
    due_date: '',
    assignee_id: '',
  });

  // Handle form submission
  const handleSubmit = (e) => {

    e.preventDefault();
    post(route('boards.items.store'));
  };

  // Generate status options based on board type
  const getStatusOptions = () => {
    // If statuses are provided from backend, use those
    if (statuses && statuses.length > 0) {
      return statuses;
    }

    // Otherwise, use default statuses based on board type
    switch(board.type.name.toLowerCase()) {
      case 'kanban':
        return ['backlog', 'todo', 'in progress', 'review', 'completed'];
      case 'roadmap':
        return ['planned', 'in progress', 'completed', 'on hold'];
      case 'ideas':
        return ['new', 'under consideration', 'approved', 'implemented', 'declined'];
      default:
        return ['todo', 'in progress', 'completed'];
    }
  };

  return (
    <AppLayout title="Create Board Item">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/boards" className="hover:text-gray-700">Boards</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href={`/boards/${board.id}`} className="hover:text-gray-700">{board.name}</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 font-medium">Add Item</span>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Item</h1>

            <div className="flex items-center gap-3">
              <Link
                href={`/boards/${board.id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Link>

              <button
                type="submit"
                form="create-item-form"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                disabled={processing}
              >
                <Save className="w-4 h-4 mr-2" />
                {processing ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </div>

          <form id="create-item-form" onSubmit={handleSubmit} className="space-y-6">
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
                  errors.title ? 'border-red-300' : ''
                }`}
                placeholder="Enter a descriptive title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={5}
                value={data.description}
                onChange={e => setData('description', e.target.value)}
                className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                  errors.description ? 'border-red-300' : ''
                }`}
                placeholder="Provide a detailed description"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={data.status}
                  onChange={e => setData('status', e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {getStatusOptions().map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  value={data.priority}
                  onChange={e => setData('priority', e.target.value)}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {(priorities || ['low', 'medium', 'high', 'urgent']).map(priority => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date and Assignee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Due Date */}
              <div>
                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
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

              {/* Assignee - If board has members */}
              {board.members && board.members.length > 0 && (
                <div>
                  <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
                    Assign To
                  </label>
                  <select
                    id="assignee"
                    value={data.assignee_id}
                    onChange={e => setData('assignee_id', e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Unassigned</option>
                    {board.members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Submit button (hidden, used by the form id) */}
            <button type="submit" hidden disabled={processing}>
              Submit
            </button>
          </form>
        </div>

        {/* Tips section */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            Tips for Creating Effective Board Items
          </h3>
          <ul className="mt-2 text-sm text-blue-700 space-y-1 pl-6 list-disc">
            <li>Use clear, concise titles that describe the task or idea</li>
            <li>Include all relevant details in the description</li>
            <li>Set realistic due dates</li>
            <li>Use priority levels appropriately to help with planning</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
