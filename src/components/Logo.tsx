import Link from "next/link";

/**
 * Logo component for sub-pages
 * Feature: logo-on-subpages
 * Requirements: 1.1, 2.1, 4.1, 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4
 */

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" aria-label="The Custard Screams - Back to home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1jT0o1Y9CW63sKRVJPxiQH09w81nhzYZI5bMg"
        srcSet="https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX12Faf3d4f6C7O5UiyzsSR8NkawKYFJxpQXubM 1x, https://xnrw2k7p6j.ufs.sh/f/kor843t3OqX1P1BEX2etUewJhN0Aqrcjg6Poimx8d2OY9G3Z 2x"
        alt="The Custard Screams logo"
        className={`h-20 w-20 rounded-full transition-opacity duration-300 hover:opacity-80 ${className}`}
      />
    </Link>
  );
}

Logo.displayName = "Logo";
