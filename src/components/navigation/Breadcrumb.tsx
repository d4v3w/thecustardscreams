"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateBreadcrumbs, shouldShowBreadcrumbs } from "~/lib/breadcrumbs";
import type { BreadcrumbProps } from "~/lib/types";

/**
 * Breadcrumb navigation component
 * Displays hierarchical navigation trail on nested pages
 * Feature: persistent-navigation-breadcrumbs
 * Requirements: 2.1, 2.2, 2.3, 2.9, 3.1, 3.2, 3.3, 3.7, 5.1, 5.2, 5.3, 5.4, 5.6, 7.1, 7.2, 7.6
 */
export default function Breadcrumb({ className = "" }: BreadcrumbProps) {
  const pathname = usePathname();

  // Don't show breadcrumbs on home page
  if (!shouldShowBreadcrumbs(pathname)) {
    return null;
  }

  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <nav
      aria-label="Breadcrumb"
      className={`bg-black text-sm ${className}`}
      role="navigation"
    >
      <ol className="flex flex-wrap items-center gap-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="flex items-center gap-2">
            {breadcrumb.isActive ? (
              <span
                className="text-gray-400"
                aria-current="page"
              >
                {breadcrumb.label}
              </span>
            ) : (
              <>
                <Link
                  href={breadcrumb.href}
                  className="text-amber-400 transition-colors duration-300 hover:text-amber-300 min-h-[44px] min-w-[44px] flex items-center"
                >
                  {breadcrumb.label}
                </Link>
                {index < breadcrumbs.length - 1 && (
                  <span className="text-gray-600" aria-hidden="true">
                    /
                  </span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
