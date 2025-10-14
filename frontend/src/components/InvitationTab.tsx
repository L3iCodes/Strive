import { Bell, Check, X } from 'lucide-react'
import { useState } from 'react'
import type { InvitationVariables } from '../types';
import { useQuery } from '@tanstack/react-query';
import { getInvites } from '../apis/collab.api';
import { useCollab } from '../hooks/useCollab';
import { useParams } from 'react-router-dom';

const InvitationTab = () => {
    const [openInvitationTab, setOpenInvitationTab] = useState(false);
    
    const { data: invitations } = useQuery<InvitationVariables[] | undefined>({
        queryKey: ['invites'],
        queryFn: getInvites
    });

    return (
        <div className='ml-auto relative'>
            <Bell onClick={() => setOpenInvitationTab(s => !s)} className={` hover:fill-base-content cursor-pointer `} size={18}/>

            {openInvitationTab && (
                <div className='w-[400px] max-h-[500px] p-2 flex flex-col gap-2 bg-base-100 border-1 border-base-content/10 shadow-2xl left-0 top-8 absolute'>
                    <h2 className='text-sm font-medium p-1 border-b-1 border-base-content/10'>Notification</h2>

                    <div className='flex flex-col gap-2 overflow-auto'>
                        {invitations?.map(invitation => (
                            <InviteCard key={invitation.inviteId} invitation={invitation} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvitationTab

const InviteCard = ({invitation}: any) => {
    const param = useParams();
    const { inviteResponseMutation } = useCollab(param.id as string);
    console.log(invitation)
    return (
        <div className='p-1 flex items-center gap-2 border-b border-base-content/10'>
            <img 
                src={invitation?.from.avatar || ''}
                className='h-7 w-7 object-cover rounded-full border-2 border-base-content/10'
            />

            {invitation?.type === 'message' && (
                <div>
                    <h2 className='text-xs font-bold'>{invitation?.from.username}</h2>
                    <p className='text-xs '>{invitation?.message}</p>
                </div>
            )}
            
            {invitation?.type === 'invite' && ( 
                <>
                    <div>
                        <h2 className='text-xs font-bold'>{invitation?.from.username}</h2>
                        <p className='text-xs '>Has invited you to collaborate in [{invitation?.board?.name}]</p>
                    </div>

                    <div className='ml-auto flex gap-1'>
                        <div 
                            onClick={() => inviteResponseMutation.mutate({ inviteId:invitation._id, action:'reject' })}
                            className='bg-base-300 rounded-full p-1 hover:bg-error hover:text-error-content cursor-pointer active:bg-error-content/50'
                            >
                                <X size={18}/>
                        </div>

                        <div
                            onClick={() => inviteResponseMutation.mutate({ inviteId:invitation._id, action:'accept' })}
                            className='bg-base-300 rounded-full p-1 hover:bg-success hover:text-success-content cursor-pointer active:bg-success/50'
                            >
                                <Check size={18}/>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};