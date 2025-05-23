import React, { useState } from 'react';
import { User, Clock, Star, Edit, Share, MoreHorizontal, Archive, ExternalLink, Trash2 } from 'lucide-react'; // adjust imports
import { Menu } from '@headlessui/react'; // assuming you're using this

export default function DataHeader({ data }) {
  const [isStarred, setIsStarred] = useState(true);

  const handleStar = () => {
    setIsStarred(prev => !prev);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              {data.type.name}
            </span>
            <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              {data.team.name}
            </span>
            <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
              {data.is_private ? 'Private' : 'Public'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          <p className="mt-2 text-gray-600">{data.description}</p>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>Created by {data.creator.name}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Created {data.created_at}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Updated {formatDate(data.updated_at)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <button
            onClick={handleStar}
            className={`p-2 rounded-full ${isStarred ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Star className="w-5 h-5" fill={isStarred ? "currentColor" : "none"} />
          </button>

          {data.can_edit && (
            <a
              href={`/boards/${data.id}/edit`}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <Edit className="w-5 h-5" />
            </a>
          )}

          <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <Share className="w-5 h-5" />
          </button>

          <Menu as="div" className="relative">
            <Menu.Button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
              <MoreHorizontal className="w-5 h-5" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10">
              <div className="py-1">
                {data.can_edit && (
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <Archive className="w-4 h-4 mr-2" />
                        Archive Board
                      </button>
                    )}
                  </Menu.Item>
                )}
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  )}
                </Menu.Item>
              </div>

              {data.can_delete && (
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        className={`${
                          active ? 'bg-red-50' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              )}
            </Menu.Items>
          </Menu>
        </div>
      </div>
    </div>
  );
}
