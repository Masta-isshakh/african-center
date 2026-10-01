'use client';

import dynamic from 'next/dynamic';
import { designs360 } from '@/content/designs';

/** Skeleton that matches the final carousel box so nothing shifts when it hydrates. */
function CarouselSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="-mx-4 flex gap-5 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        {designs360.slice(0, 3).map((slot) => (
          <div key={slot} className="shimmer-panel aspect-[2/1] w-[82%] shrink-0 rounded-xl sm:w-[46%] lg:w-[31.5%]" />
        ))}
      </div>
      <div className="mt-8 h-11" />
    </div>
  );
}

export const Designs360Lazy = dynamic(() => import('./Designs360Carousel'), { ssr: false, loading: CarouselSkeleton });
