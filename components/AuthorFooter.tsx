import Image from 'next/image';
import React from 'react';

const AuthorFooter = () => {
  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex items-start gap-6">
      <div className="flex-shrink-0">
        <Image
          src="/images/team/jovanie_rosario.jpg"
          alt="Jovanie Rosario"
          width={96}
          height={96}
          className="rounded-full shadow-md"
        />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Jovanie Rosario</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          Founder & CEO of Focus Care. Leverages over a decade of technical expertise and deep understanding of the Intellectual Disability and Autism sector to drive innovative IT solutions for disability service providers.
        </p>
      </div>
    </div>
  );
};

export default AuthorFooter;
