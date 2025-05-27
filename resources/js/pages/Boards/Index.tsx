// resources/js/Pages/Boards/Index.jsx
import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { BadgeCheck, Archive, Search, Filter, Plus, Grid3x3, List, ArrowRight } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

interface Board {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
  creator: {
    name: string;
  };
}

interface BoardStats {
  total: number;
  active: number;
  archived: number;
  recentlyUpdated: number;
}

interface PageProps {
  boards: {
    data: Board[];
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
  };
  stats: BoardStats;
  [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Boards',
    href: '/boards',
    current: true,
  } as BreadcrumbItem & { current: boolean },
];

export default function Index() {
  const { boards, stats } = usePage<PageProps>().props;
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
        {/* Header and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              My Boards
            </h1>
            <span className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full">
              {filteredBoards.length} total
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 flex gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-all duration-200",
                  viewMode === 'grid'
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-600"
                )}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-all duration-200",
                  viewMode === 'list'
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-600"
                )}
                aria-label="List view"
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "p-2 rounded-lg border transition-all duration-200",
                showFilters
                  ? "bg-gray-100 text-gray-900 border-gray-300"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
              aria-label="Toggle filters"
            >
              <Filter className="w-5 h-5" />
            </button>

            <Link
              href="/boards/create"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
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
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200"
              placeholder="Search boards by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Transition
            show={showFilters}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 -translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-1"
          >
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter by Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'active', 'archived'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as typeof statusFilter)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      statusFilter === status
                        ? "bg-gray-100 text-gray-900 border border-gray-300"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    )}
                  >
                    {status === 'active' && <BadgeCheck className="w-4 h-4 mr-1.5 inline-block" />}
                    {status === 'archived' && <Archive className="w-4 h-4 mr-1.5 inline-block" />}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </Transition>
        </div>

        {/* Empty State */}
        {filteredBoards.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 mb-4">
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
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 p-6 flex flex-col justify-between overflow-hidden"
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                      {board.name}
                    </h2>
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      board.status === 'active'
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    )}>
                      {board.status === 'active' ? (
                        <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                      ) : (
                        <Archive className="w-3.5 h-3.5 mr-1" />
                      )}
                      {board.status.charAt(0).toUpperCase() + board.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3">{board.description}</p>
                </div>

                <div className="relative mt-6 flex items-center justify-between text-sm">
                  <span className="flex items-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {board.created_at}
                  </span>
                  <span className="flex items-center text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-full">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {board.creator.name}
                  </span>
                </div>

                {/* Arrow indicator on hover */}
                <div className={cn(
                  "absolute right-4 bottom-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center",
                  "transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"
                )}>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* List View */}
        {filteredBoards.length > 0 && viewMode === 'list' && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
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
              <tbody className="divide-y divide-gray-200">
                {filteredBoards.map((board) => (
                  <tr
                    key={board.id}
                    className="group hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                    onClick={() => window.location.href = `/boards/${board.id}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                            {board.name}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">
                            {board.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        board.status === 'active'
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      )}>
                        {board.status === 'active' ? (
                          <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                        ) : (
                          <Archive className="w-3.5 h-3.5 mr-1" />
                        )}
                        {board.status.charAt(0).toUpperCase() + board.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {board.creator.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {board.updated_at}
                      </div>
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
                        ? 'z-10 bg-gray-100 border-gray-300 text-gray-900'
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
