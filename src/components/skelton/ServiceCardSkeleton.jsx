const ServiceCardSkeleton = () => {
  return (
    <div className="rounded-md flex flex-col gap-4 max-w-[400px] shadow-lg animate-pulse">
      {/* Image skeleton */}
      <div className="rounded-2xl bg-gray-200 h-[220px] w-full" />

      {/* Text skeleton */}
      <div className="p-4 ">
        <div className="h-5 w-2/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
};
export default ServiceCardSkeleton;
