'use client';

import Link, { useLinkStatus } from 'next/link';
import type { ComponentProps } from 'react';
import { MinecraftLoader } from '@/components/minecraft-loader';

export function ChapterLoading() {
  const { pending } = useLinkStatus();
  return pending ? <MinecraftLoader label="Opening the next chapter…" /> : null;
}

export function MinecraftLink({
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      {children}
      <ChapterLoading />
    </Link>
  );
}
