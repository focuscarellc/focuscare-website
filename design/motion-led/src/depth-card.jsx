import React from 'react';
import {Card} from '../../vendor/focus-care-depth-card/Card.jsx';

// Build-time composite of the Motion Card's raised variant. Frame escape changes
// the media's overflow/stacking, not the person's photograph or page camera.
export function DepthCard({name,role,company,description,asset,frameEscape=false}) {
  return <Card variant="raised" padding="none" className="founder-card fc-depth-card" data-frame-escape={String(frameEscape)}>
    <div className="depth-card__media">
      <div className="depth-card__portrait-frame" aria-hidden="true" />
      <picture className="depth-card__portrait">
        <img src={asset('founder-320.webp')} srcSet={`${asset('founder-320.webp')} 320w, ${asset('founder-640.webp')} 640w`}
          sizes="(max-width: 360px) calc(100vw - 74px), (max-width: 502px) calc(100vw - 82px), (max-width: 760px) 378px, (max-width: 1040px) calc(38.89vw - 82px), (max-width: 1200px) calc(38.89vw - 98px), 370px"
          width="640" height="557" loading="lazy" decoding="async" alt={`${name}, Founder and CEO of Focus Care`} />
      </picture>
    </div>
    <div className="depth-card__content">
      <h2>{name}</h2><p className="depth-card__role">{role}</p><p className="depth-card__company">{company}</p>
      <p className="depth-card__bio">{description}</p>
    </div>
  </Card>;
}
