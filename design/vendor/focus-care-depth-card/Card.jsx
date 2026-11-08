import React from "react";

/**
 * Focus Care — Card
 * The marketing surface primitive. Three looks, all drawn from the live site:
 *  - "soft": rounded-xl on a 1px slate ring + small shadow; lifts on hover
 *    (feature cards, testimonial card). The default.
 *  - "frost": translucent white + backdrop blur (FAQ items).
 *  - "raised": a soft shadow-xl with a hairline border (pricing cards, modals).
 */

let injected = false;
function useCardStyles() {
  if (injected || typeof document === "undefined") return;
  injected = true;
  const css = `
  .fc-card { background: var(--surface-card); color: var(--card-foreground);
    border-radius: var(--radius-xl); box-sizing: border-box; }
  .fc-card--soft { box-shadow: var(--ring-card), var(--shadow-sm);
    transition: box-shadow var(--duration-base) var(--ease-standard); }
  .fc-card--frost { background: var(--surface-frost); backdrop-filter: blur(6px); box-shadow: var(--shadow-sm); }
  .fc-card--raised { border: 1px solid var(--border); box-shadow: var(--shadow-xl); }
  .fc-card--interactive { cursor: pointer; }
  .fc-card--soft.fc-card--interactive:hover { box-shadow: var(--ring-card), var(--shadow-md); }
  .fc-card--frost.fc-card--interactive:hover { box-shadow: var(--shadow-md); }
  .fc-card__header { display: flex; align-items: flex-start; gap: 8px;
    padding: 16px 20px 12px; border-bottom: 1px solid var(--border-hairline); }
  .fc-card__title { font-size: var(--text-base); font-weight: var(--weight-semibold); color: var(--foreground); margin: 0; }
  .fc-card__subtitle { font-size: var(--text-sm); color: var(--muted-foreground); margin: 3px 0 0; }
  .fc-card__actions { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  `;
  const el = document.createElement("style");
  el.setAttribute("data-fc", "card");
  el.textContent = css;
  document.head.appendChild(el);
}

const PAD = { none: 0, sm: 16, md: 24, lg: 32 };

export function Card({
  variant = "soft",
  padding = "md",
  interactive = false,
  title,
  subtitle,
  actions,
  className = "",
  style,
  children,
  ...props
}) {
  useCardStyles();
  const hasHeader = title || subtitle || actions;
  return (
    <div
      className={[
        "fc-card",
        `fc-card--${variant}`,
        interactive ? "fc-card--interactive" : "",
        className,
      ].filter(Boolean).join(" ")}
      style={style}
      {...props}
    >
      {hasHeader && (
        <div className="fc-card__header">
          <div>
            {title && <p className="fc-card__title">{title}</p>}
            {subtitle && <p className="fc-card__subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="fc-card__actions">{actions}</div>}
        </div>
      )}
      <div style={{ padding: PAD[padding] ?? PAD.md }}>{children}</div>
    </div>
  );
}
