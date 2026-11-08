// Example of using the ImageWithShadow component

import ImageWithShadow from "@/components/image-with-shadow"

export default function ImageExample() {
  return (
    <div className="space-y-8">
      {/* Basic usage */}
      <ImageWithShadow
        src="/images/example.jpg" // Path relative to the public directory
        alt="Description of the image"
        width={400} // Width in pixels
        height={300} // Height in pixels
        className="rounded-lg" // Additional Tailwind classes
      />

      {/* With priority loading (for important above-the-fold images) */}
      <ImageWithShadow
        src="/images/hero/main-banner.jpg"
        alt="FOCUS Care hero image"
        width={1200}
        height={600}
        priority // This tells Next.js to prioritize loading this image
        className="rounded-lg"
      />

      {/* Responsive image with different sizes */}
      <ImageWithShadow
        src="/images/services/service-card.jpg"
        alt="IT Service"
        width={600}
        height={400}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="rounded-lg"
      />

      {/* Circular image (for team members) */}
      <ImageWithShadow
        src="/images/team/team-member.jpg"
        alt="Team Member"
        width={200}
        height={200}
        className="rounded-full object-cover"
      />
    </div>
  )
}

