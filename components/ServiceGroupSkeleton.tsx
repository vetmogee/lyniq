export default function ServiceGroupSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="border-b-2 border-[#636362] pb-4">
        <div className="flex items-center justify-center">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="h-8 w-48 bg-white/10 rounded" />
            <div className="h-4 w-64 bg-white/5 rounded" />
          </div>
          <div className="w-6 h-6 bg-white/10 rounded flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
