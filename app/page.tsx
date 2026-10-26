import Image from "next/image";

import Form from "./form";
import Posts from "./posts";
import Progress from "./progress";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/mirlo.space",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    name: "Mastodon",
    href: "https://musician.social/@mirlo",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12v6.406z" />
      </svg>
    ),
  },
  {
    name: "Bluesky",
    href: "https://bsky.app/profile/mirlo.space",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
      </svg>
    ),
  },
  {
    name: "Discord",
    href: "https://discord.gg/VjKq26raKX",
    icon: (
      <svg
        aria-hidden="true"
        className="w-5 h-5 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
    ),
  },
];

function SectionInfo({ className }: { className: string }) {
  return (
    <section className={`py-8 flex flex-col gap-8 ${className || ""}`}>
      <div className="flex flex-col gap-4 md:gap-8">
        <div>
          <h1>Feed the birds</h1>
          <p className={`font-bold text-xl`}>
            Support another year of independent music on Mirlo
          </p>
        </div>
        <a
          className="block lg:hidden w-full p-2 rounded-md text-center bg-mi-red hover:bg-black text-white"
          href="#form"
        >
          Donate now
        </a>
        <Progress />
      </div>
      <div className={`bg-black opacity-10 h-[30vh]`}></div>
      <div className={`flex flex-col gap-1 md:gap-2`}>
        <h2>Mirlo is turning 3!</h2>
        <p>
          Founded in 2023, Mirlo is a cooperatively-run and open-source music
          space on the social web where listeners directly support artists and
          labels. Now compatible with Fairplayer.
        </p>
      </div>
      <div className={`flex flex-col gap-1 md:gap-2`}>
        <h2>About this fundraiser: Feed the Birds 2026</h2>
        <p>
          What, where, how, when, why. We feel proud to have created a fun music
          place that gives musicians and listeners greater autonomy, through a
          transparent fee structure, community features, our burgeoning
          federation efforts and our work towards letting musicians host their
          *own* Mirlo, putting folks in control of how they present their sonic
          output online. We have also enjoyed sharing music from Mirlo as part
          of our ongoing editorial direction, helping musicians on our platform
          find an audience.
        </p>
        <p>
          To date, we have largely achieved this as a volunteer team, so imagine
          what we could do with additional funding! To that end, our goal shows
          what we think are pretty reasonable running costs and if you are able
          to support us, it would enable us to continue improving Mirlo and
          delve deeper into our work joining other platforms together into one
          network that benefits musicians, listeners and anyone who wants
          culture to be free of corporate interests and the kinds of structures
          that consolidate power in one place.
        </p>
      </div>
      <Posts />
      <div className="flex flex-col gap-1 md:gap-2">
        <h2>Join the conversation</h2>
        <ul className="flex flex-wrap gap-4">
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                className="flex items-center gap-2 hover:underline"
                href={link.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {link.icon}
                <span>{link.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="p-4 md:p-8 lg:p-16 xl:p-32 bg-[rgb(106,129,99)]">
      <header>
        <Image alt="Mirlo" src="/logo.svg" width={101} height={34} />
      </header>
      <main>
        <div className="relative flex flex-col gap-8 lg:flex-row lg:gap-16">
          <SectionInfo className="flex-1/2" />
          <Form className="flex-1/2 self-start sticky inset-bs-4 md:inset-bs-8 lg:inset-bs-16 xl:inset-bs-32" />
        </div>
      </main>
    </div>
  );
}
