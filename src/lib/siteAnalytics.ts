export type SiteEventName =
  | 'navigation_selected'
  | 'site_search_opened'
  | 'site_search_query'
  | 'site_search_result_selected'
  | 'resource_engaged'
  | 'business_horizon_selected'
  | 'pricing_engaged'
  | 'jasonai_interest_selected'
  | 'cta_selected'
  | 'contact_form_started'
  | 'contact_form_completed';

export function trackSiteEvent(name: SiteEventName, detail: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;

  window.dispatchEvent(
    new CustomEvent('b2w:measurement', {
      detail: {
        name,
        path: window.location.pathname,
        ...detail,
      },
    }),
  );
}
