import React, { Fragment } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { X, User, Mail, Lock, FileText, Activity } from 'lucide-react';

interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  description?: string;
  status?: 'active' | 'archived';
  [key: string]: any;
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserFormModal({ isOpen, onClose }: UserFormModalProps) {
  const { data, setData, post, processing, errors, reset } = useForm<CreateUserForm>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/user', {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="mx-auto max-w-lg w-full transform overflow-hidden bg-white rounded-xl shadow-lg transition-all">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <Dialog.Title className="text-base font-semibold text-gray-900">
                    Create New User
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        placeholder="Enter user's name"
                        required
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative rounded-lg shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {/* Password Group */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="password"
                          value={data.password}
                          onChange={e => setData('password', e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Enter password"
                          required
                        />
                      </div>
                      {errors.password && (
                        <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm
                      </label>
                      <div className="relative rounded-lg shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          id="password_confirmation"
                          value={data.password_confirmation}
                          onChange={e => setData('password_confirmation', e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 text-sm rounded-lg border-gray-300 focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                          placeholder="Confirm password"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex items-center justify-end space-x-2 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-gray-900 border border-transparent rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Creating...' : 'Create User'}
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
