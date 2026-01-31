'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string | null;
  relativeTime: string;
  reviewCreatedAt: Date;
}

interface ReviewsSliderProps {
  reviews: Review[];
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-lg ${
            star <= rating ? 'text-yellow-400' : 'text-gray-600'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ReviewsSlider({ reviews }: ReviewsSliderProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [startScrollPosition, setStartScrollPosition] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const lastMoveXRef = useRef(0);
  
  // Detect mobile vs desktop and get viewport width
  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // md breakpoint
      setViewportWidth(width);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const reviewsPerView = isMobile ? 1 : 2;
  const gap = 24; // 1.5rem = 24px

  // Calculate review width for mobile (90% of viewport width)
  const mobileReviewWidth = isMobile && viewportWidth > 0 ? viewportWidth * 0.9 : 0;
  
  // Calculate center padding for mobile: (viewportWidth - reviewWidth) / 2
  const mobileCenterPadding = isMobile && viewportWidth > 0 
    ? (viewportWidth - mobileReviewWidth) / 2 
    : 0;

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);


  // Scroll to a specific position
  const scrollTo = useCallback((position: number) => {
    if (!sliderRef.current) return;
    const sliderWidth = sliderRef.current.scrollWidth;
    const width = containerWidth || containerRef.current?.offsetWidth || 0;
    const maxScroll = Math.max(0, sliderWidth - width);
    const clampedPosition = Math.max(0, Math.min(maxScroll, position));
    setScrollPosition(clampedPosition);
  }, [containerWidth]);

  // Calculate how much to scroll for next/previous (2 reviews worth)
  const getScrollStep = useCallback(() => {
    // On mobile, scroll by review width + gap
    // On desktop, scroll by container width (2 reviews)
    if (isMobile && mobileReviewWidth > 0) {
      return mobileReviewWidth + gap;
    }
    return containerWidth || 800; // Fallback to 800px if not measured yet
  }, [containerWidth, isMobile, mobileReviewWidth]);

  const goToPrevious = () => {
    const step = getScrollStep();
    scrollTo(scrollPosition - step);
  };

  const goToNext = () => {
    const step = getScrollStep();
    scrollTo(scrollPosition + step);
  };

  // Check if we can scroll left/right
  const canScrollLeft = scrollPosition > 0;
  
  // Update canScrollRight asynchronously to avoid synchronous setState in effect
  useEffect(() => {
    const updateCanScrollRight = () => {
      if (!sliderRef.current || !containerRef.current) {
        setCanScrollRight(false);
        return;
      }
      const sliderWidth = sliderRef.current.scrollWidth;
      const width = containerWidth || containerRef.current.offsetWidth || 0;
      const maxScroll = Math.max(0, sliderWidth - width);
      setCanScrollRight(scrollPosition < maxScroll);
    };
    
    // Defer state update to avoid synchronous setState
    const timeoutId = setTimeout(updateCanScrollRight, 0);
    return () => clearTimeout(timeoutId);
  }, [scrollPosition, containerWidth]);


  // Handle drag start
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setDragStart(clientX);
    setStartScrollPosition(scrollPosition);
  }, [scrollPosition]);

  // Handle drag move
  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !containerRef.current || !sliderRef.current) return;

    const now = Date.now();
    const timeDelta = now - lastMoveTimeRef.current;
    const xDelta = Math.abs(clientX - lastMoveXRef.current);
    
    // Calculate velocity for momentum scrolling (only on mobile)
    if (timeDelta > 0 && isMobile) {
      velocityRef.current = xDelta / timeDelta;
    }
    
    lastMoveTimeRef.current = now;
    lastMoveXRef.current = clientX;

    const deltaX = dragStart - clientX; // Inverted: dragging right should scroll right
    const newPosition = startScrollPosition + deltaX;
    
    // Calculate max scroll inline
    const sliderWidth = sliderRef.current.scrollWidth;
    const width = containerWidth || containerRef.current?.offsetWidth || 0;
    const maxScroll = Math.max(0, sliderWidth - width);
    
    // Apply bounds with rubber band effect on mobile
    let clampedPosition = Math.max(0, Math.min(maxScroll, newPosition));
    
    // Add rubber band effect on mobile for better UX
    if (isMobile) {
      if (newPosition < 0) {
        clampedPosition = newPosition * 0.3; // Elastic resistance when dragging past start
      } else if (newPosition > maxScroll) {
        clampedPosition = maxScroll + (newPosition - maxScroll) * 0.3; // Elastic resistance when dragging past end
      }
    }
    
    setScrollPosition(clampedPosition);
  }, [isDragging, dragStart, startScrollPosition, containerWidth, isMobile]);

  // Handle drag end with momentum scrolling on mobile
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    
    // Apply momentum scrolling on mobile
    if (isMobile && velocityRef.current > 0.5 && sliderRef.current && containerRef.current) {
      const sliderWidth = sliderRef.current.scrollWidth;
      const width = containerWidth || containerRef.current.offsetWidth || 0;
      const maxScroll = Math.max(0, sliderWidth - width);
      
      // Calculate momentum distance
      const momentumDistance = velocityRef.current * 200; // Adjust multiplier for feel
      const direction = lastMoveXRef.current < dragStart ? 1 : -1;
      const targetPosition = scrollPosition + (momentumDistance * direction);
      
        // Snap to nearest review
        // On mobile, use calculated review width + gap
        const reviewWidth = isMobile && mobileReviewWidth > 0 ? mobileReviewWidth + gap : width;
        const snappedPosition = Math.round(targetPosition / reviewWidth) * reviewWidth;
        const finalPosition = Math.max(0, Math.min(maxScroll, snappedPosition));
      
      scrollTo(finalPosition);
    } else {
      // Snap to nearest review on mobile even without momentum
      if (isMobile && sliderRef.current && containerRef.current && mobileReviewWidth > 0) {
        const sliderWidth = sliderRef.current.scrollWidth;
        const width = containerWidth || containerRef.current.offsetWidth || 0;
        const maxScroll = Math.max(0, sliderWidth - width);
        // On mobile, use calculated review width + gap
        const reviewWidth = mobileReviewWidth + gap;
        const snappedPosition = Math.round(scrollPosition / reviewWidth) * reviewWidth;
        const finalPosition = Math.max(0, Math.min(maxScroll, snappedPosition));
        scrollTo(finalPosition);
      }
    }
    
    // Reset velocity
    velocityRef.current = 0;
    lastMoveTimeRef.current = 0;
    lastMoveXRef.current = 0;
  }, [isMobile, scrollPosition, containerWidth, dragStart, scrollTo, mobileReviewWidth]);

  // Memoized mouse event handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleDragMove(e.clientX);
  }, [handleDragMove]);

  const handleMouseUp = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on a button or link
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  // Touch event handlers with improved mobile support
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    const touch = e.touches[0];
    lastMoveXRef.current = touch.clientX;
    lastMoveTimeRef.current = Date.now();
    handleDragStart(touch.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    // Prevent default to stop page scrolling
    if (e.cancelable) {
      e.preventDefault();
    }
    
    const touch = e.touches[0];
    handleDragMove(touch.clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Add/remove global event listeners for mouse drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Clamp scroll position when container width changes
  useEffect(() => {
    if (containerWidth > 0 && sliderRef.current) {
      const sliderWidth = sliderRef.current.scrollWidth;
      const width = containerWidth || containerRef.current?.offsetWidth || 0;
      const maxScroll = Math.max(0, sliderWidth - width);
      setScrollPosition(prev => Math.min(prev, maxScroll));
    }
  }, [containerWidth]);

  // Update scroll position visually with smooth transitions
  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(-${scrollPosition}px)`;
      // Add smooth transition when not dragging
      if (!isDragging) {
        sliderRef.current.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }
  }, [scrollPosition, isDragging]);

  if (reviews.length === 0) {
    return null;
  }

  // Calculate total pages for indicators
  const totalPages = Math.ceil(reviews.length / reviewsPerView);
  
  // Calculate which page is currently visible based on scroll position
  // On mobile, use review width + gap, on desktop use container width
  const pageWidth = isMobile && mobileReviewWidth > 0
    ? mobileReviewWidth + gap
    : containerWidth || (isMobile ? 400 : 800); // Fallback if not measured yet
  const currentPage = pageWidth > 0 
    ? Math.min(totalPages - 1, Math.max(0, Math.round(scrollPosition / pageWidth)))
    : 0;
  
  // Show page indicators on mobile at the bottom
  const showMobileIndicators = isMobile && reviews.length > 1;

  return (
    <div className="relative">
      {/* Navigation Buttons - Hidden on mobile for cleaner swipe experience */}
      <div className={`flex items-center justify-between mb-6 ${isMobile ? 'hidden' : ''}`}>
        <button
          onClick={goToPrevious}
          disabled={!canScrollLeft}
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#b0aeab] text-white hover:bg-[#b0aeab] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Previous reviews"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const isActive = currentPage === idx;
            
            return (
              <button
                key={idx}
                onClick={() => {
                  const width = containerWidth || containerRef.current?.offsetWidth || 800;
                  scrollTo(width * idx);
                }}
                className={`h-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-white w-8'
                    : 'bg-gray-600 hover:bg-gray-500 w-2'
                }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            );
          })}
        </div>

        <button
          onClick={goToNext}
          disabled={!canScrollRight}
          className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-[#b0aeab] text-white hover:bg-[#b0aeab] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          aria-label="Next reviews"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Reviews Container */}
      <div 
        ref={containerRef}
        className="overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y md:touch-pan-x"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          touchAction: 'pan-y pinch-zoom', // Allow vertical scrolling but handle horizontal
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}
      >
        <div
          ref={sliderRef}
          className="flex gap-6"
          style={{
            transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform',
            touchAction: 'none', // Prevent default touch behavior on slider
            paddingLeft: isMobile && mobileCenterPadding > 0 ? `${mobileCenterPadding}px` : '0',
            paddingRight: isMobile && mobileCenterPadding > 0 ? `${mobileCenterPadding}px` : '0',
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 md:w-[calc((100%-1.5rem)/2)]"
              style={{
                minWidth: isMobile && mobileReviewWidth > 0 ? `${mobileReviewWidth}px` : 'calc((100% - 1.5rem) / 2)',
                maxWidth: isMobile && mobileReviewWidth > 0 ? `${mobileReviewWidth}px` : 'none',
                width: isMobile && mobileReviewWidth > 0 ? `${mobileReviewWidth}px` : 'calc((100% - 1.5rem) / 2)',
              }}
            >
              <Card variant="bordered">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg">{review.authorName}</CardTitle>
                    <span className="text-sm text-gray-500">{review.relativeTime}</span>
                  </div>
                  <StarRating rating={review.rating} />
                </CardHeader>
                <CardContent>
                  {review.text ? (
                    <p className="text-gray-300 leading-relaxed overflow-hidden" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                    }}>
                      {review.text}
                    </p>
                  ) : (
                    <p className="text-gray-500 italic">No review text available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Page Indicators */}
      {showMobileIndicators && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: reviews.length }).map((_, idx) => {
            const isActive = Math.round(scrollPosition / pageWidth) === idx;
            return (
              <div
                key={idx}
                className={`h-1.5 transition-all duration-300 ${
                  isActive
                    ? 'bg-white w-8'
                    : 'bg-gray-600 w-1.5'
                }`}
                aria-hidden="true"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
