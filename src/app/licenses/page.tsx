import Link from 'next/link';
import { RAILNOVA_CONTACT } from '@/lib/contact';

const RUNTIME_PACKAGES = [
  { name: 'next', version: '16.4.6', license: 'MIT', url: 'https://nextjs.org' },
  { name: 'react', version: '19.1.0', license: 'MIT', url: 'https://react.dev/' },
  { name: 'react-dom', version: '19.1.0', license: 'MIT', url: 'https://react.dev/' },
  { name: 'framer-motion', version: '14.14.0', license: 'MIT', url: 'https://motion.dev/' },
  { name: 'gsap', version: '3.15.1', license: "Standard 'no charge' license", url: 'https://gsap.com/standard-license/' },
  { name: 'jspdf', version: '4.2.1', license: 'MIT', url: 'https://github.com/parallax/jsPDF' },
  { name: 'lucide-react', version: '1.80.0', license: 'ISC', url: 'https://lucide.dev' },
  { name: 'maplibre-gl', version: '6.19.0', license: 'BSD-3-Clause', url: 'https://maplibre.org/' },
  { name: 'qrcode', version: '1.5.4', license: 'MIT', url: 'https://github.com/soldair/node-qrcode' },
  { name: 'zod', version: '4.6.7', license: 'MIT', url: 'https://zod.dev' },
];

const TOOLING_PACKAGES = [
  { name: 'tailwindcss', version: '4.3.5', license: 'MIT' },
  { name: '@tailwindcss/postcss', version: '4.3.5', license: 'MIT' },
  { name: 'postcss', version: '8.5.33', license: 'MIT' },
  { name: 'typescript', version: '6.0.3', license: 'Apache-2.0' },
  { name: 'eslint', version: '9.39.5', license: 'MIT' },
  { name: 'eslint-config-next', version: '16.4.6', license: 'MIT' },
];

export default function LicensesPage() {
  return (
    <div className="pt-28 pb-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="space-y-3 border-b border-(--border-subtle) pb-6">
        <span className="text-xs font-mono-tech uppercase tracking-widest text-(--accent-primary)">
          Attributions &amp; Compliance
        </span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">
          Open-Source Licences
        </h1>
        <p className="text-sm text-(--text-secondary) max-w-2xl leading-relaxed">
          RailNova is built with open-source libraries, web fonts, and licensed editorial imagery. Below are the exact packages and licences shipped in this application.
        </p>
      </div>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Runtime Dependencies</h2>
        <div className="overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--bg-surface)">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-(--border-subtle) font-mono-tech text-(--text-secondary)">
              <tr>
                <th className="p-3.5">Package</th>
                <th className="p-3.5">Version</th>
                <th className="p-3.5">Licence</th>
                <th className="p-3.5">Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {RUNTIME_PACKAGES.map((pkg) => (
                <tr key={pkg.name}>
                  <td className="p-3.5 font-mono-tech font-semibold text-(--text-primary)">{pkg.name}</td>
                  <td className="p-3.5 font-mono-tech text-(--text-secondary)">{pkg.version}</td>
                  <td className="p-3.5 font-mono-tech text-(--accent-primary)">{pkg.license}</td>
                  <td className="p-3.5">
                    <a
                      href={pkg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-(--text-secondary) hover:text-(--accent-primary) underline underline-offset-2"
                    >
                      Reference
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-xl font-bold">Build &amp; Development Tooling</h2>
        <div className="overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--bg-surface)">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-(--border-subtle) font-mono-tech text-(--text-secondary)">
              <tr>
                <th className="p-3.5">Package</th>
                <th className="p-3.5">Version</th>
                <th className="p-3.5">Licence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle)">
              {TOOLING_PACKAGES.map((pkg) => (
                <tr key={pkg.name}>
                  <td className="p-3.5 font-mono-tech font-semibold text-(--text-primary)">{pkg.name}</td>
                  <td className="p-3.5 font-mono-tech text-(--text-secondary)">{pkg.version}</td>
                  <td className="p-3.5 font-mono-tech text-(--accent-primary)">{pkg.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-(--border-subtle) bg-(--bg-surface) p-6 space-y-2 text-xs text-(--text-secondary) leading-relaxed">
        <h2 className="font-display text-base font-bold text-(--text-primary)">Typography &amp; Photography</h2>
        <p>
          Typography uses <strong>Space Grotesk</strong>, <strong>Manrope</strong>, and <strong>JetBrains Mono</strong> served via <code className="font-mono-tech text-(--text-primary)">next/font/google</code> under the SIL Open Font License 1.1. Destination photography is served from Unsplash under the Unsplash License.
        </p>
        <p className="pt-1">
          Questions about licence compliance? Email{' '}
          <a href={`mailto:${RAILNOVA_CONTACT.email}`} className="text-(--accent-primary) underline underline-offset-2">
            {RAILNOVA_CONTACT.email}
          </a>{' '}
          or review our{' '}
          <Link href="/terms" className="text-(--accent-primary) underline underline-offset-2">
            Terms &amp; Conditions
          </Link>.
        </p>
      </section>
    </div>
  );
}
