"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const FilloutConsultation = () => {
  return (
    <div className="not-prose mt-10 p-6 md:p-8 bg-primary/5 border border-primary/10 rounded-lg text-center">
      <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
        Ready to Transform Your Care?
      </h2>
      <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto leading-relaxed">
        Contact us today for a free consultation and discover how Focus Care can elevate your services.
      </p>
      <Button asChild size="lg">
        <Link href="/contact">
          Schedule Your Free Consultation
        </Link>
      </Button>
    </div>
  );
};

export default FilloutConsultation;
