import Socials from "./Socials";

export const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="mt-6 flex flex-col items-center p-2 text-amber-200">
      <Socials type="all" />
      <p>Copyright &copy; {currentYear} The Custard Screams</p>
    </footer>
  );
};

Footer.displayName = "Footer";
export default Footer;
