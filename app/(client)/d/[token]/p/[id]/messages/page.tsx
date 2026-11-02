import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChatApp from '@/components/client/chat/ChatApp';
import { api, isAccessToken, isProjectId, orNull } from '@/lib/client/api';

export const metadata: Metadata = { title: 'Chat' };

/** The chat with the Project Lead, filling the page. */
export default async function ChatPage({ params }: { params: { token: string; id: string } }) {
  if (!isAccessToken(params.token) || !isProjectId(params.id)) notFound();
  const chat = (await orNull(api.chat(params.token, params.id))) ?? notFound();
  return (
    <div className="-mb-14 -mt-2 lg:-mt-4">
      <ChatApp token={params.token} project={params.id} initial={chat} />
    </div>
  );
}
