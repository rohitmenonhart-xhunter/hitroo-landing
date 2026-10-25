'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';
import type { ShowcaseVideoContent } from '@/lib/creatives-video';
import { mediaUrl } from '@/lib/media';
import { cn } from '@/lib/utils';

/**
 * A video in a frame of its own shape (9:16 reels, 16:9 films; a file in public/ or in object storage, either plays as is). It loads nothing until it nears the screen, then plays muted on a loop while
 * on screen (its on-screen type carries the story) and pauses when it leaves. The sound button restarts it with
 * sound. With reduced motion it never autoplays: the poster waits for a press of play.
 */
export default function ShowcaseVideo({ video, className }: { video: Pick<ShowcaseVideoContent, 'src' | 'poster' | 'width' | 'height' | 'title' | 'seconds'>; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(false);
  /** Whether it is on screen enough to play (kept in a ref so the load effect can read it). */
  const visible = useRef(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStill(reduce);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        visible.current = e.intersectionRatio >= 0.4;
        if (reduce) return;
        if (visible.current) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: '200px 0px', threshold: [0, 0.4] }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // The file is attached only once the video nears the screen; if it is already in view by then, start it.
  useEffect(() => {
    const v = ref.current;
    if (near && v && visible.current && !still) v.play().catch(() => {});
  }, [near, still]);

  const toggleSound = () => {
    const v = ref.current;
    if (!v) return;
    if (v.muted) {
      v.muted = false;
      v.currentTime = 0;
      v.play().catch(() => {});
    } else {
      v.muted = true;
    }
    setMuted(v.muted);
  };

  const togglePlay = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  };

  return (
    <figure className={cn('relative overflow-hidden rounded-[28px] bg-sand ring-1 ring-char/10', className)} style={{ aspectRatio: `${video.width} / ${video.height}` }}>
      <video
        ref={ref}
        className="h-full w-full object-cover"
        poster={mediaUrl(video.poster)}
        src={near ? mediaUrl(video.src) : undefined}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={`${video.title}: a ${video.seconds}-second video. The transcript is below.`}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? 'Pause the video' : 'Play the video'}
          className={cn(
            'glass-warm flex h-11 w-11 items-center justify-center rounded-full text-char focus-visible:outline focus-visible:outline-2 focus-visible:outline-char',
            !still && !playing && 'opacity-90'
          )}
        >
          {playing ? <Pause aria-hidden="true" className="h-4 w-4" /> : <Play aria-hidden="true" className="h-4 w-4" />}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-pressed={!muted}
          className="glass-warm inline-flex h-11 items-center gap-2 rounded-full px-4 text-[14px] font-bold text-char focus-visible:outline focus-visible:outline-2 focus-visible:outline-char"
        >
          {muted ? <VolumeX aria-hidden="true" className="h-4 w-4" /> : <Volume2 aria-hidden="true" className="h-4 w-4 text-ember" />}
          {muted ? 'Sound on' : 'Sound off'}
        </button>
      </div>
    </figure>
  );
}
