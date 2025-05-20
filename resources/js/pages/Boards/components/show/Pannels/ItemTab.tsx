import { AlertTriangle, CheckCircle, Edit,Eye,MessageSquare,MoreHorizontal, Plus } from 'lucide-react'; // adjust imports
import { Menu, Tab } from '@headlessui/react'; // assuming you're using this
import { Link } from '@inertiajs/react';

export default function ItemTab({ data }) {

    return (
        <>
        <Tab.Panel>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Board Items</h2>
                    <Link
                        href={`/boards/${data.id}/items/create`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-blue-700 transition"
                    >
                    <Plus className="w-4 h-4 mr-2" />
                        Add Item
                    </Link>
                </div>

                {/* Empty state for items */}
                {data.items.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                    <p className="text-gray-500 mb-4 max-w-md mx-auto">
                        This board doesn't have any items yet. Get started by adding your first item.
                    </p>
                    <Link
                        href={`/boards/${data.id}/items/create`}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-blue-700 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Item
                    </Link>
                    </div>
                )}

                {/* Items list (if there are items) */}
                {data.items.length > 0 && (
                    <div className="space-y-4">
                    {data.items.map((item) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                        <div className="flex justify-between">
                            <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                <Link href={`/boards/${data.id}/items/${item.id}`}>
                                {item.title}
                                </Link>
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>

                            <div className="flex gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                <MessageSquare className="w-4 h-4 mr-1" />
                                <span>{item.comments_count || 0}</span>
                                </div>
                                <div className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                <span>{item.views_count || 0}</span>
                                </div>
                                {item.status && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {item.status}
                                </span>
                                )}
                            </div>
                            </div>

                            <div>
                            <Menu as="div" className="relative">
                                <Menu.Button className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                                </Menu.Button>
                                <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-10">
                                <div className="py-1">
                                    <Menu.Item>
                                    {({ active }) => (
                                        <Link
                                        href={`/boards/${data.id}/items/${item.id}/edit`}
                                        className={`${
                                            active ? 'bg-gray-100' : ''
                                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                                        >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                        </Link>
                                    )}
                                    </Menu.Item>
                                </div>
                                </Menu.Items>
                            </Menu>
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
                </Tab.Panel>
        </>
    )
}
