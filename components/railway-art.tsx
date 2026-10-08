import Image from 'next/image';

/** A static capture of our constructed voxel model; no renderer ships here. */
export function RailwayArt({ decorative = false }: { decorative?: boolean }) {
  return (
    <Image
      className="railway-art"
      src="/images/railway/locomotive.jpg"
      alt={
        decorative
          ? ''
          : 'A riveted copper locomotive and oak carriage on iron rails, with cubic oak trees and a grass-block foundation.'
      }
      width={880}
      height={680}
      unoptimized
      loading="eager"
    />
  );
}
