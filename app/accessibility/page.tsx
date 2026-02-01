import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accessibility Statement - FOCUS Care",
  description: "Accessibility Statement for FOCUS Care LLC website and services.",
}

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Accessibility Statement</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p className="text-lg">
          FOCUS Care LLC is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.
        </p>
        
        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Conformance Status</h2>
        <p>
          The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">Web Content Accessibility Guidelines (WCAG)</a> defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA.
        </p>
        <p>
          FOCUS Care is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard. We are actively working to address these areas.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Feedback</h2>
        <p>
          We welcome your feedback on the accessibility of the FOCUS Care website. Please let us know if you encounter accessibility barriers on our site:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Phone:</strong> +1 (202) 455-0325
          </li>
          <li>
            <strong>E-mail:</strong> <a href="mailto:info@focuscarellc.com" className="text-secondary hover:underline">info@focuscarellc.com</a>
          </li>
          <li>
            <strong>Postal Address:</strong> 239 4th Ave Suite 1401, Unit #7549, Pittsburgh, PA 15222
          </li>
        </ul>
        <p>
          We try to respond to feedback within 2 business days.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Technical Specifications</h2>
        <p>
          Accessibility of the FOCUS Care website relies on the following technologies to work with the particular combination of web browser and any assistive technologies or plugins installed on your computer:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>HTML</li>
          <li>WAI-ARIA</li>
          <li>CSS</li>
          <li>JavaScript</li>
        </ul>
        <p>
          These technologies are relied upon for conformance with the accessibility standards used.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Assessment Approach</h2>
        <p>
          FOCUS Care assessed the accessibility of the FOCUS Care website by the following approaches:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Self-evaluation</li>
        </ul>
        
        <p className="mt-8 text-sm text-gray-500">
          This statement was created on {new Date().toLocaleDateString()}.
        </p>
      </div>
    </div>
  )
}
