'use client';

export default function Loading({ label = 'Načítání...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-white/10" />
          <div
            className="absolute inset-0 border-2 border-transparent border-t-white animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
        </div>
        {/* Text */}
        <p className="text-white/50 text-sm tracking-widest uppercase font-sans">
          {label}
        </p>
      </div>
    </div>
  );
}
