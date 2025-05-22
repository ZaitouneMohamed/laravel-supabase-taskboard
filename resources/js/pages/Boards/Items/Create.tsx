// resources/js/Pages/Boards/Items/Create.jsx
import React, { Fragment, useState, useEffect } from 'react';
import { usePage, useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Save,
  X,
  AlertCircle,
  CalendarClock,
  ListTodo,
  Flag,
  User
} from 'lucide-react';

export default function CreateBoardItem({ isOpen, onClose, boardSLug }) {
  // Get board data from props or fetch it if not available
  const { board, statuses, priorities } = usePage().props;
  const newData = board?.data || { id: null, name: 'Board' };

  // Initialize form with useForm
  const { data, setData, post, processing, errors, reset } = useForm({
    boardId: newData.id,
    title: '',
    description: '',
    status: 'todo', // Default status
    priority: 'Urgent', // Default priority
    due_date: '',
    assignee_id: 8,
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('boards.items.store'), {
    preserveScroll: true,
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  // Generate status options based on board type
  const getStatusOptions = () => {
    // If statuses are provided from backend, use those
    if (statuses && statuses.length > 0) {
      return statuses;
    }

    // Otherwise, use default statuses based on board type
    return ['todo', 'in-progress', 'done'];
  };

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen]);

  // Generate priority background styles
  const getPriorityStyles = (priority) => {
    const styles = {
      'Low': 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      'Medium': 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      'High': 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      'Urgent': 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    };
    return styles[priority] || styles.medium;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white p-6 shadow-xl transition-all text-left">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center"
                  >
                    <div className="w-8 h-8 mr-2 bg-blue-100 rounded-full flex items-center justify-center">
                      <ListTodo className="w-4 h-4 text-blue-600" />
                    </div>
                    Add New Item
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-full p-1.5 bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500"
                    onClick={onClose}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Form */}
                <form id="create-item-form" onSubmit={handleSubmit} className="space-y-5">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        {getStatusOptions().map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Priority */}
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Flag className="w-4 h-4 mr-1 text-gray-500" />
                        Priority
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(priorities || ['low', 'medium', 'high', 'urgent']).map(priority => (
                          <button
                            key={priority}
                            type="button"
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                              data.priority === priority
                                ? `${getPriorityStyles(priority)} ring-2 ring-offset-1 ${priority === 'low' ? 'ring-green-500' : priority === 'medium' ? 'ring-blue-500' : priority === 'high' ? 'ring-orange-500' : 'ring-red-500'}`
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                    {/* Assignee - If board has members */}
                    <div>
                      <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <User className="w-4 h-4 mr-1 text-gray-500" />
                        Assign To
                      </label>
                      <select
                        id="assignee"
                        value={data.assignee_id}
                        onChange={e => setData('assignee_id', e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="">Unassigned</option>
                        {board?.members && board.members.map(member => (
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
                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={onClose}
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
