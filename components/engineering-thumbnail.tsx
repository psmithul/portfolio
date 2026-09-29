'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import type { ModelKind, EngineeringScene } from '@/lib/engineering-scene';
import { ProjectVisual } from '@/components/project-visual';

export function EngineeringThumbnail({ kind }: { kind: ModelKind }) {
  const host = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState('');
  useEffect(() => {
    let cancelled = false,
      started = false,
      engine: EngineeringScene | undefined;
    if (!host.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started) return;
        started = true;
        observer.disconnect();
        import('@/lib/engineering-scene')
          .then(({ createEngineeringScene }) => {
            if (cancelled || !host.current) return;
            engine = createEngineeringScene(
              host.current,
              () => ({
                model: kind,
                running: false,
                exploded: false,
                stiffness: 1,
                terrain: 0,
              }),
              {
                thumbnail: true,
                onRendered(image) {
                  if (!cancelled) setSource(image);
                  requestAnimationFrame(() => engine?.dispose());
                },
              },
            );
          })
          .catch(() => {
            /* The descriptive vector illustration remains available without WebGL. */
          });
      },
      { rootMargin: '150px' },
    );
    observer.observe(host.current);
    return () => {
      cancelled = true;
      observer.disconnect();
      engine?.dispose();
    };
  }, [kind]);
  return (
    <div className="engineering-thumbnail">
      {source ? (
        <Image
          src={source}
          unoptimized
          alt={`${kind} concept rendered in 3D`}
          width={640}
          height={390}
        />
      ) : (
        <ProjectVisual kind={kind} />
      )}
      <div className="thumbnail-renderer" ref={host} aria-hidden="true" />
    </div>
  );
}
