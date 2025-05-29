// resources/js/Pages/Teams/Index.tsx
import React, { useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import { Search, Plus, Pencil, Trash2, Users, User2, Building2 } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import TeamFormModal from '@/components/TeamFormModal';
import Swal from 'sweetalert2';

interface Team {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar?: string;
  owner: {
    id: number;
    name: string;
  };
  users: Array<{
    id: number;
    name: string;
    role: string;
  }>;
}

interface PageProps {
  [key: string]: any;
  data: {
    data: Team[];
    links: {
      first: string;
      last: string;
      prev: string | null;
      next: string | null;
    };
    meta: {
      current_page?: number;
      from?: number;
      last_page?: number;
      path?: string;
      per_page?: number;
      to?: number;
      total?: number;
    };
  };
  filters: {
    search?: string;
    per_page?: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Teams', href: '/teams', current: true } as BreadcrumbItem & { current: boolean }
];

export default function Index() {
  const { data, filters } = usePage<PageProps>().props;
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleDelete = (teamId: number, teamName: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${teamName}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#111827',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-xl',
        title: 'text-lg font-semibold text-gray-900',
        htmlContainer: 'text-base text-gray-600',
        confirmButton: 'rounded-lg text-sm font-medium',
        cancelButton: 'rounded-lg text-sm font-medium',
        actions: 'space-x-2'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(`/team/${teamId}`, {
          onSuccess: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Team has been deleted successfully.',
              icon: 'success',
              customClass: {
                popup: 'rounded-xl',
                title: 'text-lg font-semibold text-gray-900',
                htmlContainer: 'text-base text-gray-600',
                confirmButton: 'rounded-lg text-sm font-medium bg-gray-900 text-white px-4 py-2 hover:bg-gray-800'
              }
            });
          }
        });
      }
    });
  };

  // Filter teams based on search
  const filteredTeams = data.data.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Team
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="group relative bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div className="p-4">
                {/* Header - Team Icon and Name */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center">
                      <span className="text-lg font-semibold text-white">
                        {team.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {team.name}
                  </h3>
                </div>

                {/* Team Info */}
                <div className="space-y-2">
                  {team.description && (
                    <div className="flex items-start text-sm text-gray-500 gap-2">
                      <Building2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{team.description}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <User2 className="w-4 h-4 flex-shrink-0" />
                    <span>Owner: {team.owner.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 gap-2">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    <span>{team.users.length} members</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    href={`/team/${team.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(team.id, team.name)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeams.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 text-lg mb-2">No teams found</div>
            <div className="text-gray-500 text-sm">
              {searchTerm ? 'Try adjusting your search' : 'Get started by creating your first team'}
            </div>
          </div>
        )}

        {/* Pagination */}
        {data.links && (
          <div className="mt-8">
            <nav className="flex justify-center space-x-2" aria-label="Pagination">
              {/* Previous Page */}
              <Link
                href={data.links.prev || '#'}
                className={cn(
                  "relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                  !data.links.prev
                    ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                )}
                preserveScroll
                preserveState
              >
                Previous
              </Link>

              {/* Current Page Info */}
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                Page {data.meta.current_page} of {data.meta.last_page}
              </span>

              {/* Next Page */}
              <Link
                href={data.links.next || '#'}
                className={cn(
                  "relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg",
                  !data.links.next
                    ? "text-gray-400 bg-gray-50 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                )}
                preserveScroll
                preserveState
              >
                Next
              </Link>
            </nav>
          </div>
        )}

        <TeamFormModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </AppLayout>
  );
}
