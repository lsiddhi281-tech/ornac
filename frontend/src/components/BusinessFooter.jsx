import { Link } from "react-router-dom";
import { businessProfile } from "../utils/businessProfile";

export default function BusinessFooter() {
  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms & Conditions", path: "/terms-and-conditions" },
    { label: "Refund Policy", path: "/refund-policy" },
    { label: "Shipping Policy", path: "/shipping-policy" },
    { label: "Cancellation Policy", path: "/cancellation-policy" },
    { label: "Disclaimer", path: "/disclaimer" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/faq" }
  ];

  return (
    <footer className="mt-12 border-t bg-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-700">{businessProfile.brandName}</h3>
          <p className="text-sm text-zinc-500">{businessProfile.marathiName}</p>
          <p className="mt-2 text-sm">{businessProfile.businessDescription}</p>
          <p className="mt-2 text-sm font-medium">Tagline: {businessProfile.tagline}</p>
        </div>
        <div>
          <h4 className="font-semibold">Business Details</h4>
          <p className="mt-2 text-sm">{businessProfile.businessType}</p>
          <p className="mt-2 text-sm">{businessProfile.businessAddress}</p>
          <p className="mt-2 text-sm">Phone: {businessProfile.phone}</p>
          <p className="mt-2 text-sm">Website: {businessProfile.website}</p>
        </div>
        <div>
          <h4 className="font-semibold">Policies</h4>
          <div className="mt-3 grid gap-2 text-sm text-zinc-600">
            {legalLinks.map((link) => (
              <Link key={link.path} to={link.path} className="transition hover:text-brand-700">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold">Owner & Social</h4>
          <p className="mt-2 text-sm">{businessProfile.ownerName}</p>
          <p className="mt-2 text-sm">{businessProfile.ownerAddress}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <a className="rounded border px-2 py-1" href={businessProfile.socials.youtube} target="_blank" rel="noreferrer">YouTube</a>
            <a className="rounded border px-2 py-1" href={businessProfile.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="rounded border px-2 py-1" href={businessProfile.socials.twitter} target="_blank" rel="noreferrer">Twitter</a>
            <a className="rounded border px-2 py-1" href={businessProfile.socials.telegram} target="_blank" rel="noreferrer">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
