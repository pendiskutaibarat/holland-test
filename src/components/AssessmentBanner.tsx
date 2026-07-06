"use client";

import Image from "next/image";

interface AssessmentBannerProps {
  src: string;
  alt: string;
}

export default function AssessmentBanner({
  src,
  alt,
}: AssessmentBannerProps) {
  return (
    <div className="mx-auto w-full max-w-[1120px] overflow-hidden rounded-2xl shadow-soft">
      <Image
        src={src}
        alt={alt}
        width={4950}
        height={1238}
        priority
        sizes="(max-width: 768px) 92vw, 1120px"
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
