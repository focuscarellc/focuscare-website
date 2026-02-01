import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - FOCUS Care",
  description: "Terms of Service for FOCUS Care LLC website and services.",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Terms of Service</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">1. Agreement to Terms</h2>
        <p>
          By accessing our website at https://focuscarellc.com, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">2. Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on FOCUS Care's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>modify or copy the materials;</li>
          <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
          <li>attempt to decompile or reverse engineer any software contained on FOCUS Care's website;</li>
          <li>remove any copyright or other proprietary notations from the materials; or</li>
          <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
        </ul>
        <p>
          This license shall automatically terminate if you violate any of these restrictions and may be terminated by FOCUS Care at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">3. Disclaimer</h2>
        <p>
          The materials on FOCUS Care's website are provided on an 'as is' basis. FOCUS Care makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">4. Limitations</h2>
        <p>
          In no event shall FOCUS Care or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on FOCUS Care's website, even if FOCUS Care or a FOCUS Care authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">5. Accuracy of Materials</h2>
        <p>
          The materials appearing on FOCUS Care's website could include technical, typographical, or photographic errors. FOCUS Care does not warrant that any of the materials on its website are accurate, complete or current. FOCUS Care may make changes to the materials contained on its website at any time without notice. However FOCUS Care does not make any commitment to update the materials.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">6. Links</h2>
        <p>
          FOCUS Care has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by FOCUS Care of the site. Use of any such linked website is at the user's own risk.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">7. Governing Law</h2>
        <p>
          These terms and conditions are governed by and construed in accordance with the laws of Pennsylvania and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
        </p>
      </div>
    </div>
  )
}
