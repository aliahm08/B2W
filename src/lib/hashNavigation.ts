const LANDING_NAV_OFFSET = 104;

export function scrollToHashTarget(hash: string, behavior: ScrollBehavior = 'smooth') {
  const id = hash.replace(/^#/, '').trim();
  if (!id) {
    return false;
  }

  const element = document.getElementById(id);
  if (!element) {
    return false;
  }

  const top = window.scrollY + element.getBoundingClientRect().top - LANDING_NAV_OFFSET;
  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  });
  return true;
}
