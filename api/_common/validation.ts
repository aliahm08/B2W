const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATA_URL_PATTERN = /^data:image\/png;base64,[a-z0-9+/=\s]+$/i;

export type CleanStringOptions = {
  required?: boolean;
  maxLength?: number;
};

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; status: number; error: string };

export type LeadSubmission = {
  name: string;
  email: string;
  company: string;
  phone: string;
  website: string;
  budgetRange: string;
  inquiryType: string;
  message: string;
  arrRange: string;
  projectAreas: string[];
  normalizedProjectArea: string;
  sourcePage: string;
  sourcePath: string;
  sourceUrl: string;
  referrer: string;
  submittedAt: string;
};

export type ClientCommunicationSubmission = {
  clientName: string;
  clientEmail: string;
  company: string;
  projectName: string;
  messageCategory: string;
  message: string;
  sourcePage: string;
  sourcePath: string;
  sourceUrl: string;
  referrer: string;
  submittedAt: string;
};

export type ProposalSignatureSubmission = {
  signerName: string;
  signerEmail: string;
  company: string;
  proposalName: string;
  proposalId: string;
  proposalUrl: string;
  actionTaken: string;
  notes: string;
  selectedOptionId: string;
  selectedOptionTitle: string;
  selectedOptionPrice: string;
  acceptedTerms: boolean;
  signatureName: string;
  signatureDataUrl: string;
  sourcePage: string;
  sourcePath: string;
  sourceUrl: string;
  referrer: string;
  submittedAt: string;
};

function sanitizeText(value: unknown, options: CleanStringOptions = {}): string {
  const normalized = String(value ?? '')
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .trim();

  if (!normalized) {
    return '';
  }

  const maxLength = options.maxLength ?? 5000;
  return normalized.slice(0, maxLength);
}

function requireText(label: string, value: unknown, options: CleanStringOptions = {}): ValidationResult<string> {
  const cleaned = sanitizeText(value, { ...options, required: true });
  if (!cleaned) {
    return { ok: false, status: 400, error: `${label} is required.` };
  }

  return { ok: true, value: cleaned };
}

function optionalText(value: unknown, maxLength = 5000): string {
  return sanitizeText(value, { maxLength });
}

function requireEmail(value: unknown, label = 'Email'): ValidationResult<string> {
  const result = requireText(label, value, { maxLength: 320 });
  if (!result.ok) {
    return result;
  }

  const email = result.value.toLowerCase();
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, status: 400, error: `${label} must be a valid email address.` };
  }

  return { ok: true, value: email };
}

function requireBoolean(label: string, value: unknown): ValidationResult<boolean> {
  if (typeof value === 'boolean') {
    return { ok: true, value };
  }

  if (value === 'true') {
    return { ok: true, value: true };
  }

  if (value === 'false') {
    return { ok: true, value: false };
  }

  return { ok: false, status: 400, error: `${label} is required.` };
}

function requireProjectAreas(value: unknown): ValidationResult<string[]> {
  if (!Array.isArray(value)) {
    return { ok: false, status: 400, error: 'Project areas are required.' };
  }

  const areas = value
    .map((entry) => sanitizeText(entry, { maxLength: 64 }))
    .filter(Boolean);

  if (areas.length === 0) {
    return { ok: false, status: 400, error: 'At least one project area is required.' };
  }

  return { ok: true, value: Array.from(new Set(areas)) };
}

export function validateHoneypot(payload: Record<string, unknown>): ValidationResult<true> {
  const honeypot = sanitizeText(payload.websiteUrl ?? payload.companyWebsite ?? payload.faxNumber ?? '', {
    maxLength: 256,
  });

  if (honeypot) {
    return { ok: false, status: 400, error: 'Spam check failed.' };
  }

  return { ok: true, value: true };
}

export function validateLeadSubmission(payload: Record<string, unknown>): ValidationResult<LeadSubmission> {
  const name = requireText('Name', payload.name, { maxLength: 160 });
  if (name.ok === false) return { ok: false, status: name.status, error: name.error };
  const email = requireEmail(payload.email);
  if (email.ok === false) return { ok: false, status: email.status, error: email.error };
  const company = requireText('Business', payload.company ?? payload.businessName, { maxLength: 200 });
  if (company.ok === false) return { ok: false, status: company.status, error: company.error };
  const phone = requireText('Phone', payload.phone, { maxLength: 80 });
  if (phone.ok === false) return { ok: false, status: phone.status, error: phone.error };
  const message = requireText('Message', payload.message, { maxLength: 5000 });
  if (message.ok === false) return { ok: false, status: message.status, error: message.error };
  const inquiryType = requireText('Inquiry type', payload.inquiryType ?? payload.normalizedProjectArea, { maxLength: 120 });
  if (inquiryType.ok === false) return { ok: false, status: inquiryType.status, error: inquiryType.error };
  const projectAreas = requireProjectAreas(payload.projectAreas ?? []);
  if (projectAreas.ok === false) return { ok: false, status: projectAreas.status, error: projectAreas.error };

  return {
    ok: true,
    value: {
      name: name.value,
      email: email.value,
      company: company.value,
      phone: phone.value,
      website: optionalText(payload.website, 500),
      budgetRange: optionalText(payload.budgetRange ?? payload.arrRange, 120),
      inquiryType: inquiryType.value,
      message: message.value,
      arrRange: optionalText(payload.arrRange, 80),
      projectAreas: projectAreas.value,
      normalizedProjectArea: optionalText(payload.normalizedProjectArea, 120) || inquiryType.value,
      sourcePage: optionalText(payload.sourcePage, 200),
      sourcePath: optionalText(payload.sourcePath, 200),
      sourceUrl: optionalText(payload.sourceUrl, 500),
      referrer: optionalText(payload.referrer, 500),
      submittedAt: optionalText(payload.submittedAt, 80) || new Date().toISOString(),
    },
  };
}

export function validateClientCommunicationSubmission(
  payload: Record<string, unknown>,
): ValidationResult<ClientCommunicationSubmission> {
  const clientName = requireText('Client name', payload.clientName, { maxLength: 160 });
  if (clientName.ok === false) return { ok: false, status: clientName.status, error: clientName.error };
  const clientEmail = requireEmail(payload.clientEmail ?? payload.email, 'Client email');
  if (clientEmail.ok === false) return { ok: false, status: clientEmail.status, error: clientEmail.error };
  const projectName = requireText('Project / account', payload.projectName, { maxLength: 200 });
  if (projectName.ok === false) return { ok: false, status: projectName.status, error: projectName.error };
  const message = requireText('Message', payload.message, { maxLength: 5000 });
  if (message.ok === false) return { ok: false, status: message.status, error: message.error };

  return {
    ok: true,
    value: {
      clientName: clientName.value,
      clientEmail: clientEmail.value,
      company: optionalText(payload.company ?? payload.businessName, 200),
      projectName: projectName.value,
      messageCategory: optionalText(payload.messageCategory ?? payload.actionType, 120) || 'client_message',
      message: message.value,
      sourcePage: optionalText(payload.sourcePage, 200),
      sourcePath: optionalText(payload.sourcePath, 200),
      sourceUrl: optionalText(payload.sourceUrl, 500),
      referrer: optionalText(payload.referrer, 500),
      submittedAt: optionalText(payload.submittedAt, 80) || new Date().toISOString(),
    },
  };
}

export function validateProposalSignatureSubmission(
  payload: Record<string, unknown>,
): ValidationResult<ProposalSignatureSubmission> {
  const signerName = requireText('Signer name', payload.signerName ?? payload.fullName ?? payload.clientName, { maxLength: 160 });
  if (signerName.ok === false) return { ok: false, status: signerName.status, error: signerName.error };
  const signerEmail = requireEmail(payload.signerEmail ?? payload.email, 'Signer email');
  if (signerEmail.ok === false) return { ok: false, status: signerEmail.status, error: signerEmail.error };
  const proposalName = requireText('Proposal / project name', payload.proposalName ?? payload.projectName, { maxLength: 200 });
  if (proposalName.ok === false) return { ok: false, status: proposalName.status, error: proposalName.error };
  const actionTaken = requireText('Action taken', payload.actionTaken ?? payload.actionType, { maxLength: 120 });
  if (actionTaken.ok === false) return { ok: false, status: actionTaken.status, error: actionTaken.error };
  const acceptedTerms = requireBoolean('Accepted terms', payload.acceptedTerms);
  if (acceptedTerms.ok === false) return { ok: false, status: acceptedTerms.status, error: acceptedTerms.error };
  const signatureName = optionalText(payload.signatureName ?? payload.fullName, 160) || signerName.value;
  const signatureDataUrl = optionalText(payload.signatureDataUrl, 400_000);

  if (!signatureName && !signatureDataUrl) {
    return { ok: false, status: 400, error: 'Signature is required.' };
  }

  if (signatureDataUrl && !DATA_URL_PATTERN.test(signatureDataUrl)) {
    return { ok: false, status: 400, error: 'Signature must be a PNG data URL when provided.' };
  }

  return {
    ok: true,
    value: {
      signerName: signerName.value,
      signerEmail: signerEmail.value,
      company: optionalText(payload.company, 200),
      proposalName: proposalName.value,
      proposalId: optionalText(payload.proposalId ?? payload.selectedOptionId, 200),
      proposalUrl: optionalText(payload.proposalUrl ?? payload.sourceUrl, 500),
      actionTaken: actionTaken.value,
      notes: optionalText(payload.notes ?? payload.message, 5000),
      selectedOptionId: optionalText(payload.selectedOptionId, 120),
      selectedOptionTitle: optionalText(payload.selectedOptionTitle, 200),
      selectedOptionPrice: optionalText(payload.selectedOptionPrice, 120),
      acceptedTerms: acceptedTerms.value,
      signatureName,
      signatureDataUrl,
      sourcePage: optionalText(payload.sourcePage, 200),
      sourcePath: optionalText(payload.sourcePath, 200),
      sourceUrl: optionalText(payload.sourceUrl, 500),
      referrer: optionalText(payload.referrer, 500),
      submittedAt: optionalText(payload.submittedAt, 80) || new Date().toISOString(),
    },
  };
}
