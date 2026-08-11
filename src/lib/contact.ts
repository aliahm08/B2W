export const CONTACT_EMAIL = 'info@b2w-ai.com';
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

export const isContactEmailHref = (to: string) => to.startsWith('mailto:');
