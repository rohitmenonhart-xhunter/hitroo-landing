import { Bone, Loading } from '@/components/client/Skeleton';

/** The chat's frame at once: its header, a few message shapes and the box to write in. */
export default function ChatLoading() {
  return (
    <div className="-mb-14 -mt-2 lg:-mt-4">
      <Loading />
      <div className="flex h-[calc(100dvh-12.5rem)] min-h-[460px] flex-col overflow-hidden rounded-[28px] bg-white ring-1 ring-char/5 lg:h-[calc(100dvh-5.5rem)]">
        <div className="flex items-center gap-3 border-b border-char/[0.06] px-6 py-4">
          <Bone className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Bone className="h-4 w-24" />
            <Bone className="h-3 w-44" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[780px] flex-1 space-y-6 px-6 py-8">
          <Bone className="ml-auto h-10 w-64 rounded-[20px]" />
          <div className="flex gap-3">
            <Bone className="h-8 w-8 shrink-0 rounded-full" />
            <div className="w-full space-y-2.5">
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-5/6" />
              <Bone className="h-4 w-2/3" />
            </div>
          </div>
        </div>
        <div className="border-t border-char/[0.06] px-6 py-4">
          <Bone className="mx-auto h-14 w-full max-w-[780px] rounded-[22px]" />
        </div>
      </div>
    </div>
  );
}
