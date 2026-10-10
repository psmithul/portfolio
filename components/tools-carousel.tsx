'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type PortfolioTool = {
  name: string;
  logo?: string;
  wordmark?: string;
  width: number;
  height: number;
};

export function ToolsCarousel({
  tools,
  staticLayout = false,
}: {
  tools: PortfolioTool[];
  staticLayout?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  return (
    <section
      id="tools"
      className="flow-tools flow-section"
      aria-labelledby="tools-heading"
      data-paused={paused || staticLayout}
      data-layout={staticLayout ? 'grid' : undefined}
    >
      <div className="tools-heading shell">
        <p className="eyebrow">05 — Technical skills</p>
        <h2 id="tools-heading">Tools</h2>
      </div>
      <div className="tools-viewport">
        <div className="tools-track">
          {(staticLayout ? [false] : [false, true]).map((duplicate) => (
            <ul
              className="tools-group"
              key={String(duplicate)}
              aria-hidden={duplicate || undefined}
              aria-label={
                duplicate ? undefined : 'Software and programming tools'
              }
            >
              {tools.map((tool) => (
                <li className="tool-card" key={tool.name} data-tool={tool.name}>
                  {tool.logo ? (
                    <Image
                      className="tool-logo"
                      src={tool.logo}
                      width={tool.width}
                      height={tool.height}
                      alt=""
                      unoptimized
                    />
                  ) : (
                    <span className="tool-wordmark" aria-hidden="true">
                      {tool.wordmark ?? tool.name}
                    </span>
                  )}
                  <span>{tool.name}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="tools-caption shell">
        <p className="flow-instrumentation">
          IMU <span>·</span> Multimeter <span>·</span> Vernier caliper{' '}
          <span>·</span> Data acquisition <span>·</span> Prototyping{' '}
          <span>·</span> Experimental testing
        </p>
        {!staticLayout && (
          <Button
            variant="outline"
            className="tools-motion-control"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Resume tool carousel' : 'Pause tool carousel'}
            aria-pressed={paused}
          >
            {paused ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause aria-hidden="true" />
            )}
            {paused ? 'Resume' : 'Pause'}
          </Button>
        )}
      </div>
    </section>
  );
}
