import Logo from "~/components/Logo";
import Breadcrumb from "~/components/navigation/Breadcrumb";

/**
 * Layout for live shows pages with breadcrumb navigation
 * Feature: persistent-navigation-breadcrumbs, logo-on-subpages
 * Requirements: 2.1, 4.2, 4.3, 4.4, 1.1, 3.1, 3.2, 3.3, 3.4, 3.5, 7.1, 7.2, 7.3, 7.4, 7.5, 9.1, 9.2, 9.3, 9.4, 9.5
 */
export default function LiveShowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-20">
      <div className="p-4 md:p-6">
        <Logo />
      </div>
      <Breadcrumb />
      <main className="p-4 md:p-6">{children}</main>
    </div>
  );
}
