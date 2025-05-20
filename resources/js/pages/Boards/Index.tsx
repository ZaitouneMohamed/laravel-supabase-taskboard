// resources/js/Pages/Boards/Index.jsx
import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { BadgeCheck, Archive, Search, Filter, Plus, Grid3x3, ViewList } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Boards',
    href: '/boards',
    current: true,
  },
];

export default function Index() {
  const { boards, stats } = usePage().props;
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter boards based on search term and status
  const filteredBoards = boards.data.filter((board) => {
    const matchesSearch = board.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         board.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || board.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Total Boards</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.total || boards.data.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Active Boards</p>
            <p className="text-2xl font-bold text-green-600">{stats?.active || boards.data.filter(b => b.status === 'active').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Archived</p>
            <p className="text-2xl font-bold text-gray-600">{stats?.archived || boards.data.filter(b => b.status === 'archived').length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <p className="text-sm font-medium text-gray-500">Recently Updated</p>
            <p className="text-2xl font-bold text-blue-600">{stats?.recent || 0}</p>
          </div>
        </div>

        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Boards</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              aria-label="List view"
            >
              <Grid3x3 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-md ${showFilters ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              aria-label="Toggle filters"
            >
              <Filter className="w-5 h-5 text-gray-700" />
            </button>
            <Link
              href="/boards/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Board</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Transition
            show={showFilters}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-700 mb-3">Filter by Status</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'active', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      statusFilter === status
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </Transition>
        </div>

        {/* Empty State */}
        {filteredBoards.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <Archive className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No boards found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? "No boards match your current filters. Try adjusting your search criteria."
                : "You haven't created any boards yet. Get started by creating your first board."}
            </p>
            <Link
              href="/boards/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create a board
            </Link>
          </div>
        )}

        {/* Grid View */}
        {filteredBoards.length > 0 && viewMode === 'grid' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map((board) => (
              <Link
                href={`/boards/${board.id}`}
                key={board.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition border p-5 flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition">
                      {board.name}
                    </h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      board.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {board.status === 'active' ? (
                        <BadgeCheck className="w-3 h-3 mr-1" />
                      ) : (
                        <Archive className="w-3 h-3 mr-1" />
                      )}
                      {board.status.charAt(0).toUpperCase() + board.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{board.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-xs text-gray-500">
                    Updated {board.updated_at}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    by {board.creator.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* List View */}
        {filteredBoards.length > 0 && viewMode === 'list' && (
          <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Updated
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBoards.map((board) => (
                  <tr key={board.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/boards/${board.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {board.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {board.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        board.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {board.status === 'active' ? (
                          <BadgeCheck className="w-3 h-3 mr-1" />
                        ) : (
                          <Archive className="w-3 h-3 mr-1" />
                        )}
                        {board.status.charAt(0).toUpperCase() + board.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {board.creator.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {board.updated_at}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredBoards.length > 0 && (
          <div className="mt-10 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              {boards.links.map((link, i) =>
                link.url ? (
                  <Link
                    key={i}
                    href={link.url}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      link.active
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    } ${i === 0 ? 'rounded-l-md' : ''} ${
                      i === boards.links.length - 1 ? 'rounded-r-md' : ''
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ) : (
                  <span
                    key={i}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500"
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
