import Image from "next/image";
import Link from "next/link";

import Form from "./form";

function SectionInfo({ className }: { className: string }) {
  return (
    <section className={`py-8 flex flex-col gap-8 ${className || ""}`}>
      <div>
        <h1>Feed the birds</h1>
        <p className={`font-bold text-xl`}>
          Support another year of independent music on Mirlo
        </p>
        <a
          className="mt-4 block lg:hidden w-full p-2 rounded-md text-center bg-mi-red hover:bg-black text-white"
          href="#form"
        >
          Donate now
        </a>
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
    </section>
  );
}

export default function Home() {
  return (
    <div className="p-4 md:p-8 lg:p-16 xl:p-32 bg-[#99ccdd]">
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
