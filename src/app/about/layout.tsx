import Breadcrumb from "~/components/navigation/Breadcrumb";

/**
 * Layout for about pages with breadcrumb navigation
 * Feature: persistent-navigation-breadcrumbs
 * Requirements: 2.1, 4.2, 4.3, 4.4
 */
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20">
      <Breadcrumb className="p-4" />
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
