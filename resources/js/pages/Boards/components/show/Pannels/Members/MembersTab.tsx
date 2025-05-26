import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import InviteMembersModal from './InviteMembersModal';
import { router } from '@inertiajs/react';

export default function MembersTab({ data, usersToInvite }) {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    const members = data?.members || [];

    // Function to handle member deletion
    const handleDeleteMember = async (boardSlug , memberId) => {
        if (confirm('Are you sure you want to remove this member from the board?')) {
        setIsDeleting(true);

            router.delete(route('boards.members.delete' , boardSlug + memberId ));
        }
    };


    return (
        <>
        {/* Members Tab */}
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Board Members</h2>
            {data.can_edit && (
                <button
                onClick={() => setIsInviteModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-medium text-sm text-white hover:bg-blue-700 transition"
                >
                <Plus className="w-4 h-4 mr-2" />
                Invite Member
                </button>
            )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Creator/Owner */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                    {data.creator.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{data.creator.name}</div>
                    <div className="text-sm text-gray-500">{data.creator.email}</div>
                </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Owner
                </span>
            </div>

                {/* Map through members safely */}
            {members.map(member => (
                <div key={member.id} className="p-4 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-medium">
                    {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Member
                </span>
                {data.can_edit && (
                    <button
                        onClick={() => handleDeleteMember(data.slug , member.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                        disabled={isDeleting}
                        title="Remove member"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    )}
                </div>
            ))}

            {/* Show message if there are no other members */}
            {members.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                This board has no additional members.
                </div>
            )}
            </div>

        {isInviteModalOpen && (
            <InviteMembersModal
            isOpen={isInviteModalOpen}
            boardSLug={data.slug}
            usersToInvite={usersToInvite}
            onClose={() => setIsInviteModalOpen(false)}
            />
        )}
        </>
    );
}
