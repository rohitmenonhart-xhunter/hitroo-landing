import { Bone, BoneCard, BoneHeader, Loading } from '@/components/client/Skeleton';

export default function QuoteLoading() {
  return (
    <>
      <Loading />
      <BoneHeader />
      <Bone className="h-48 w-full rounded-[28px]" />
      <BoneCard className="mt-6" lines={3} />
    </>
  );
}
