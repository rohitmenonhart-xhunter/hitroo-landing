import { BoneCard, BoneHeader, Loading } from '@/components/client/Skeleton';

export default function ProjectLoading() {
  return (
    <>
      <Loading />
      <BoneHeader />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <BoneCard key={i} lines={1} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <BoneCard lines={5} />
        <BoneCard lines={4} />
      </div>
    </>
  );
}
