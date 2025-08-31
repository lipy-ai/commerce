import { env } from "@envClient";
import { Separator } from "@lipy/web-ui/components/ui/separator";
import { Link } from "@tanstack/react-router";

interface MenuItem {
  title: string;
  links: {
    text: string;
    url: string;
    target?: string;
    rel?: string;
  }[];
}

interface Footer2Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  tagline?: string;
  menuItems?: MenuItem[];
  copyright?: string;
  bottomLinks?: {
    text: string;
    url: string;
  }[];
}

export const Footer = ({
  menuItems = [
    {
      title: "",
      links: [],
    },
    {
      title: "",
      links: [],
    },
    {
      title: "",
      links: [
        { text: "About", url: `${env.WEB_URL}/about` },
        { text: "Contact", url: `${env.WEB_URL}/contact` },
        { text: "Privacy", url: `${env.WEB_URL}/privacy` },
        { text: "Terms & Condition", url: `${env.WEB_URL}/terms` },
        { text: "Want to be seller?", url: env.MERCHANT_URL },
      ],
    },
    {
      title: "",
      links: [
        // { text: "Twitter", url: "#" },
        { text: "Instagram", url: env.INSTAGRAM },
        {
          text: "LinkedIn",
          url: env.LINKEDIN,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      ],
    },
  ],
  copyright = "© Steinsgate Pvt ltd, 2025 - All rights reserved.",
  bottomLinks = [
    { text: "Terms and Conditions", url: "/terms" },
    { text: "Privacy Policy", url: "privacy" },
  ],
}: Footer2Props) => {
  return (
    <section className="">
      <div className="">
        <footer className="bg-muted">
          <div className=" grid grid-cols-2 gap-2 md:gap-8 lg:grid-cols-6 container m-auto p-8">
            <div className="col-span-2 lg:mb-0 flex items-center gap-4">
              <div className="flex items-center gap-2 lg:justify-start shrink-0">
                <Link to="/">
                  <img
                    src="/logo/logo.png"
                    alt="Lipy logo"
                    className="w-20 h-16 rounded-lg shrink-0"
                  />
                </Link>
              </div>
              <div>
                <p className="text-lg font-bold">VOCAL FOR LOCAL</p>

                <p className="text-muted-foreground md:max-w-58">
                  Order food, grocery & medicines from your favourite local
                  stores.
                </p>
              </div>
            </div>
            {menuItems.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="text-muted-foreground space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="hover:text-primary font-medium"
                    >
                      <a rel={link.rel} target={link.target} href={link.url}>
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <Separator />
          <div className="text-muted-foreground flex flex-col justify-between gap-4 text-sm font-medium md:flex-row md:items-center p-4 px-8">
            <p>{copyright}</p>
            <ul className="flex gap-4">
              {bottomLinks.map((link, linkIdx) => (
                <li key={linkIdx} className="hover:text-primary underline">
                  <a href={link.url}>{link.text}</a>
                </li>
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};
