import crypto from 'node:crypto';
import { VerifyInputNormalized } from './types';

const sanitize = (value?: string) =>
  (value || '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const normalizeAliases = (knownAliases?: string): string[] =>
  (knownAliases || '')
    .split(/[\n,]/)
    .map((a) => sanitize(a).replace(/^@/, ''))
    .filter(Boolean);

const extractPhotoData = (photoBase64: string): string => {
  const trimmed = photoBase64.trim();
  if (trimmed.startsWith('data:')) {
    const match = trimmed.match(/^data:[^;]+;base64,(.+)$/);
    return match?.[1] || '';
  }
  return trimmed;
};

export function validateAndNormalizeInput(payload: any): VerifyInputNormalized {
  const fullName = sanitize(payload?.fullName);
  const email = sanitize(payload?.email).toLowerCase();
  const limitedContext = sanitize(payload?.limitedContext);
  const notes = sanitize(payload?.notes);
  const githubUsername = sanitize(payload?.githubUsername).replace(/^@/, '') || undefined;
  const linkedinUrl = sanitize(payload?.linkedinUrl) || undefined;
  const knownAliases = normalizeAliases(payload?.knownAliases);
  const photoBase64 = typeof payload?.photoBase64 === 'string' ? payload.photoBase64 : '';

  if (!fullName) {
    throw new Error('Full name is required.');
  }

  if (!email || !email.includes('@')) {
    throw new Error('Valid email is required.');
  }

  if (!payload?.organizerConsentAcknowledged) {
    throw new Error('Affirmative organizer consent is required before discovery.');
  }

  if (!photoBase64) {
    throw new Error('A consented image is required for this investigation run.');
  }

  if (!limitedContext) {
    throw new Error('Limited context is required for real-source discovery.');
  }

  const photoData = extractPhotoData(photoBase64);
  if (!photoData) {
    throw new Error('Invalid image payload.');
  }

  const photoSha256 = crypto.createHash('sha256').update(photoData).digest('hex');

  return {
    fullName,
    email,
    githubUsername,
    linkedinUrl,
    notes: notes || undefined,
    limitedContext,
    knownAliases,
    photoBase64,
    organizerConsentAcknowledged: true,
    photoSha256,
  };
}
