/**
 * Input validation utilities for frontend
 */

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): { valid: boolean; message?: string } {
  if (!email) return { valid: false, message: 'Email is required' };
  if (!emailRegex.test(email)) return { valid: false, message: 'Invalid email format' };
  return { valid: true };
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password) return { valid: false, message: 'Password is required' };
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true };
}

export function validateName(name: string): { valid: boolean; message?: string } {
  const trimmed = name.trim();
  if (!trimmed) return { valid: false, message: 'Name is required' };
  if (trimmed.length < 2) return { valid: false, message: 'Name must be at least 2 characters' };
  if (trimmed.length > 50) return { valid: false, message: 'Name must not exceed 50 characters' };
  return { valid: true };
}

export function validateBio(bio: string): { valid: boolean; message?: string } {
  if (bio && bio.length > 500) {
    return { valid: false, message: 'Bio must not exceed 500 characters' };
  }
  return { valid: true };
}

export function validateUrl(url: string): { valid: boolean; message?: string } {
  if (!url) return { valid: true }; // Optional
  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, message: 'Invalid URL format' };
  }
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML/script tags
    .slice(0, 1000); // Limit length
}

export function validateForm(data: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) errors.email = emailValidation.message!;
  }

  if (data.password) {
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.valid) errors.password = passwordValidation.message!;
  }

  if (data.name) {
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) errors.name = nameValidation.message!;
  }

  if (data.bio !== undefined) {
    const bioValidation = validateBio(data.bio);
    if (!bioValidation.valid) errors.bio = bioValidation.message!;
  }

  return errors;
}
