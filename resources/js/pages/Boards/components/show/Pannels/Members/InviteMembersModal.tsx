import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Search, UserPlus } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function InviteMembersModal({ isOpen, onClose, boardSLug, usersToInvite }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);


    const { setData, errors, post, processing, reset } = useForm({
       user_ids: [],
    });


    function handleInviteSubmit(e) {
        e.preventDefault();
        setData('user_ids', selectedUsers); // Update form data right before submission
        post(route('boards.members.store', boardSLug), {
            onSuccess: () => {
            reset();
            setSelectedUsers([]); // Also reset selected users
            },
        });
    }

  // Handle user selection in the modal
    function toggleUserSelection(userId) {
    if (selectedUsers.includes(userId)) {
        const updatedSelection = selectedUsers.filter(id => id !== userId);
        setSelectedUsers(updatedSelection);
        setData('user_ids', updatedSelection); // Update form data
    } else {
        const updatedSelection = [...selectedUsers, userId];
        setSelectedUsers(updatedSelection);
        setData('user_ids', updatedSelection); // Update form data
    }
    }

  // Filter users based on search query
  const filteredUsers = usersToInvite ? usersToInvite.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Invite Members
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="mt-2 max-h-60 overflow-y-auto">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      {searchQuery ? 'No users found. Try another search.' : 'No users available to invite.'}
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <li key={user.id} className="py-3">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`user-${user.id}`}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              checked={selectedUsers.includes(user.id)}
                              onChange={() => toggleUserSelection(user.id)}
                            />
                            <label
                              htmlFor={`user-${user.id}`}
                              className="ml-3 flex items-center cursor-pointer"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {errors.user_ids && (
                  <p className="mt-2 text-sm text-red-600">{errors.user_ids}</p>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={`inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md ${
                      selectedUsers.length === 0 || processing
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    onClick={handleInviteSubmit}
                    disabled={selectedUsers.length === 0 || processing}
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {selectedUsers.length === 1 ? 'Invite 1 Member' : `Invite ${selectedUsers.length} Members`}
                      </>
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
