import { CookieSettingsLink } from "./cookie/CookieSettingsLink";

export const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="mt-6 flex flex-col items-center gap-2 p-2 text-amber-200">
      <p>Copyright &copy; {currentYear} The Custard Screams</p>
      <CookieSettingsLink className="text-sm" />
    </footer>
  );
};

Footer.displayName = "Footer";
export default Footer;
