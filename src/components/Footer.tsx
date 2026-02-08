import { CookieSettingsLink } from "./cookie/CookieSettingsLink";

export const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="mt-8 flex flex-col items-center gap-3 p-4 md:p-6 text-amber-200">
      <p>Copyright &copy; {currentYear} The Custard Screams</p>
      <CookieSettingsLink className="text-sm" />
    </footer>
  );
};

Footer.displayName = "Footer";
export default Footer;
