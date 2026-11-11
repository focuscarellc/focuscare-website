import posthog from 'posthog-js';

const allowed = new Set([
  '$current_url', '$pathname', '$host', '$referring_domain', '$referrer',
  '$browser', '$browser_version', '$os', '$os_version', '$device_type',
  '$screen_width', '$screen_height', '$viewport_width', '$viewport_height',
  '$lib', '$lib_version', '$session_id', '$window_id', '$pageview_id',
  '$device_id', '$is_identified', 'distinct_id', '$anon_distinct_id', 'token',
  '$prev_pageview_id', '$prev_pageview_pathname', '$prev_pageview_duration',
  'site', 'service', 'source_path', 'placement', 'is_test', '$process_person_profile'
]);
const currentURL = () => location.origin + location.pathname;
const referrer = () => { try { return new URL(document.referrer).origin; } catch { return ''; } };
const events = new Set(['$pageview', '$pageleave', 'contact CTA clicked', 'service link clicked', 'email app opened', 'email link clicked', 'phone link clicked', 'software link clicked', 'checklist link clicked', 'workflow selected', 'contact draft prepared']);
const services = new Set(['recruitment', 'training', 'payroll', 'operations', 'billing', 'compliance', 'unspecified']);
const placements = new Set(['faq', 'navigation', 'footer', 'hero', 'page']);

export function startAnalytics({ token, host }) {
  posthog.init(token, {
    api_host: host,
    defaults: '2026-01-30',
    persistence: 'localStorage+cookie',
    persistence_name: 'focuscare_services_analytics',
    cross_subdomain_cookie: false,
    secure_cookie: true,
    person_profiles: 'identified_only',
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    capture_exceptions: false,
    disable_session_recording: true,
    enable_heatmaps: false,
    rageclick: false,
    advanced_disable_feature_flags: true,
    advanced_disable_flags: true,
    // Deliberate QA traffic is marked below and excluded from daily reports.
    opt_out_useragent_filter: new URLSearchParams(location.search).get('analytics_test') === '1',
    disable_surveys: true,
    respect_dnt: true,
    before_send: event => {
      if (navigator.globalPrivacyControl || navigator.doNotTrack === '1' || !events.has(event.event)) return null;
      const props = Object.fromEntries(Object.entries(event.properties || {}).filter(([key]) => allowed.has(key)));
      // No query strings, fragments, form values, care data, emails or names.
      props.$current_url = currentURL(); props.$pathname = location.pathname; props.$host = location.hostname;
      props.$referrer = referrer();
      props.$referring_domain = referrer() ? new URL(referrer()).hostname : '';
      props.source_path = location.pathname;
      if (props.service && !services.has(props.service)) delete props.service;
      if (props.placement && !placements.has(props.placement)) delete props.placement;
      props.site = 'focuscare-services'; props.$process_person_profile = false;
      props.is_test = new URLSearchParams(location.search).get('analytics_test') === '1';
      event.properties = props;
      return event;
    }
  });
  if (posthog.has_opted_out_capturing()) {
    posthog.opt_in_capturing();
    posthog.capture('$pageview');
  }
  return posthog;
}
