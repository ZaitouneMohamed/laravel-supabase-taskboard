// resources/js/Pages/Boards/Show.jsx
import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import {
  ChevronRight,
} from 'lucide-react';
import DataHeader from './components/show/dataHeader';
import AppLayout from '@/layouts/app-layout';
import { Menu, Tab } from '@headlessui/react';
import ItemTab from './components/show/Pannels/ItemTab';
import MembersTab from './components/show/Pannels/Members/MembersTab';

export default function Show() {
// Modify this line
    const { board, usersToInvite } = usePage().props;
    const [isStarred, setIsStarred] = useState(board.is_starred);

    // To this
    const data = board.data; // Access the nested board data

    console.log(board.data);


  return (
    <AppLayout title={data.name}>
      <div className="max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/dashboard" className="hover:text-gray-700">Dashboard</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/boards" className="hover:text-gray-700">Boards</Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-900 font-medium">{data.name}</span>
        </div>

        <DataHeader data={data} />

        {/* data Content Tabs */}
        <Tab.Group>
          <Tab.List className="flex border-b border-gray-200 mb-6">
            <Tab className={({ selected }) =>
              `py-3 px-5 text-sm font-medium ${
                selected
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
              }`
            }>
              Items
            </Tab>
            <Tab className={({ selected }) =>
              `py-3 px-5 text-sm font-medium ${
                selected
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
              }`
            }>
              Members
            </Tab>
            <Tab className={({ selected }) =>
              `py-3 px-5 text-sm font-medium ${
                selected
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
              }`
            }>
              Activity
            </Tab>
            {data.can_edit && (
              <Tab className={({ selected }) =>
                `py-3 px-5 text-sm font-medium ${
                  selected
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`
              }>
                Settings
              </Tab>
            )}
          </Tab.List>

          <Tab.Panels>
            {/* Items Tab */}
            <ItemTab canAddTasks={data.canAddTasks}  MainTasks={data.items_by_status} boardSLug={data.slug} />

            <MembersTab data={data} usersToInvite={usersToInvite} />

            {/* Activity Tab */}
            <Tab.Panel>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center text-gray-500 py-8">
                  No recent activity to display.
                </div>
              </div>
            </Tab.Panel>

            {/* Settings Tab (only available if user can edit) */}
            {data.can_edit && (
              <Tab.Panel>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Board Settings</h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <form className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">General Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Board Name</label>
                          <input
                            type="text"
                            id="name"
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            defaultValue={data.name}
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            id="description"
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            defaultValue={data.description}
                          />
                        </div>

                        <div className="sm:grid sm:grid-cols-2 sm:gap-4">
                          <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Board Type</label>
                            <select
                              id="type"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              defaultValue={data.type.id}
                            >
                              <option value={data.type.id}>{data.type.name}</option>
                            </select>
                          </div>

                          <div>
                            <label htmlFor="team" className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                            <select
                              id="team"
                              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              defaultValue={data.team.id}
                            >
                              <option value={data.team.id}>{data.team.name}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Settings & Permissions</h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="is_private"
                              name="is_private"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked={data.is_private}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="is_private" className="font-medium text-gray-700">Private Board</label>
                            <p className="text-gray-500">Only invited members can access this board.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="enable_voting"
                              name="enable_voting"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked={data.settings.enable_voting}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="enable_voting" className="font-medium text-gray-700">Enable Voting</label>
                            <p className="text-gray-500">Allow members to vote on board items.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="allow_comments"
                              name="allow_comments"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked={data.settings.allow_comments}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="allow_comments" className="font-medium text-gray-700">Allow Comments</label>
                            <p className="text-gray-500">Allow members to comment on board items.</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="show_creator"
                              name="show_creator"
                              type="checkbox"
                              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                              defaultChecked={data.settings.show_creator}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="show_creator" className="font-medium text-gray-700">Show Creator</label>
                            <p className="text-gray-500">Show the creator's information on the board.</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </Tab.Panel>
            )}
          </Tab.Panels>
        </Tab.Group>
      </div>
    </AppLayout>
  );
}
