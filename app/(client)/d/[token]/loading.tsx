import { BoneCard, BoneHeader, Loading } from '@/components/client/Skeleton';

export default function HomeLoading() {
  return (
    <>
      <Loading />
      <BoneHeader />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <BoneCard key={i} className="min-h-[240px]" lines={2} />
        ))}
      </div>
    </>
  );
}
