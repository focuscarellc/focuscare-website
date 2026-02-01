import Image from 'next/image';
import React from 'react';

const AuthorFooter = () => {
  return (
    <div className="not-prose mt-14 pt-8 border-t border-border flex items-start gap-4 md:gap-5">
      <div className="flex-shrink-0">
        <Image
          src="/images/team/jovanie_rosario.jpg"
          alt="Jovanie Rosario"
          width={72}
          height={72}
          className="rounded-full ring-2 ring-border w-14 h-14 md:w-[72px] md:h-[72px] object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground mb-0.5">Written by</p>
        <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5 leading-tight">
          Jovanie Rosario
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Founder &amp; CEO of Focus Care. Over a decade of technical expertise driving innovative IT solutions for disability service providers in the Intellectual Disability and Autism sector.
        </p>
      </div>
    </div>
  );
};

export default AuthorFooter;
