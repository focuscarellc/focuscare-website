import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - FOCUS Care",
  description: "Privacy Policy for FOCUS Care LLC website and services.",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 md:py-24 max-w-4xl">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">Privacy Policy</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>
          At FOCUS Care LLC, accessible from https://focuscarellc.com, one of our main priorities is the privacy of our visitors. 
          This Privacy Policy document contains types of information that is collected and recorded by FOCUS Care and how we use it.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Information We Collect</h2>
        <p>
          We collect several different types of information for various purposes to provide and improve our Service to you.
        </p>
        <h3 className="text-xl font-semibold mt-4 mb-2">Personal Data</h3>
        <p>
          While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Email address</li>
          <li>First name and last name</li>
          <li>Phone number</li>
          <li>Business name and address</li>
          <li>Cookies and Usage Data</li>
        </ul>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">How We Use Your Information</h2>
        <p>FOCUS Care uses the collected data for various purposes:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide and maintain the Service</li>
          <li>To notify you about changes to our Service</li>
          <li>To provide customer care and support</li>
          <li>To provide analysis or valuable information so that we can improve the Service</li>
          <li>To monitor the usage of the Service</li>
          <li>To detect, prevent and address technical issues</li>
        </ul>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Log Files</h2>
        <p>
          FOCUS Care follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Cookies</h2>
        <p>
          Like any other website, FOCUS Care uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>

        <h2 className="text-2xl font-bold text-primary dark:text-white mt-8 mb-4">Contact Us</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
        </p>
        <p className="mt-4">
          <strong>Email:</strong> info@focuscarellc.com<br />
          <strong>Phone:</strong> +1 (202) 455-0325<br />
          <strong>Address:</strong> 239 4th Ave Suite 1401, Unit #7549, Pittsburgh, PA 15222
        </p>
      </div>
    </div>
  )
}
