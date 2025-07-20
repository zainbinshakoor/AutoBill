import { VALIDATION_RULES } from './constants';

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  if (!VALIDATION_RULES.EMAIL.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return `Password must be at least ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} characters long`;
  }
  if (password.length > VALIDATION_RULES.PASSWORD.MAX_LENGTH) {
    return `Password must not exceed ${VALIDATION_RULES.PASSWORD.MAX_LENGTH} characters`;
  }
  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name) {
    return 'Name is required';
  }
  if (name.trim().length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters long`;
  }
  if (name.trim().length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return `Name must not exceed ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`;
  }
  return null;
};

// Amount validation
export const validateAmount = (amount: string): string | null => {
  if (!amount) {
    return 'Amount is required';
  }
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount)) {
    return 'Please enter a valid amount';
  }
  
  if (numAmount < VALIDATION_RULES.AMOUNT.MIN) {
    return `Amount must be at least $${VALIDATION_RULES.AMOUNT.MIN}`;
  }
  
  if (numAmount > VALIDATION_RULES.AMOUNT.MAX) {
    return `Amount must not exceed $${VALIDATION_RULES.AMOUNT.MAX.toLocaleString()}`;
  }
  
  return null;
};

// Description validation
export const validateDescription = (description: string): string | null => {
  if (!description) {
    return 'Description is required';
  }
  
  if (description.trim().length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
    return `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters long`;
  }
  
  if (description.trim().length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    return `Description must not exceed ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`;
  }
  
  return null;
};

// General required field validation
export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
};

// Phone number validation (optional)
export const validatePhone = (phone: string): string | null => {
  if (!phone) return null; // Optional field
  
  const phoneRegex = /^\+?[\d\s-()]+$/;
  if (!phoneRegex.test(phone)) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// Date validation
export const validateDate = (date: string): string | null => {
  if (!date) {
    return 'Date is required';
  }
  
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return 'Please enter date in YYYY-MM-DD format';
  }
  
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    return 'Please enter a valid date';
  }
  
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 1); // Allow future dates up to 1 year
  
  if (parsedDate > maxDate) {
    return 'Date cannot be more than 1 year in the future';
  }
  
  return null;
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  
  return null;
};

// URL validation (optional)
export const validateUrl = (url: string): string | null => {
  if (!url) return null; // Optional field
  
  try {
    new URL(url);
    return null;
  } catch {
    return 'Please enter a valid URL';
  }
};

// Credit card validation (optional)
export const validateCreditCard = (cardNumber: string): string | null => {
  if (!cardNumber) return null; // Optional field
  
  const cleanedCardNumber = cardNumber.replace(/\s/g, '');
  const cardRegex = /^\d{13,19}$/;
  
  if (!cardRegex.test(cleanedCardNumber)) {
    return 'Please enter a valid credit card number';
  }
  
  return null;
};

// Custom validation function type
export type ValidationFunction = (value: string, ...args: any[]) => string | null;

// Validation helper to run multiple validations
export const runValidations = (
  value: string,
  validations: ValidationFunction[]
): string | null => {
  for (const validation of validations) {
    const error = validation(value);
    if (error) {
      return error;
    }
  }
  return null;
};

// Form validation helper
export const validateForm = <T extends Record<string, any>>(
  formData: T,
  validationRules: Partial<Record<keyof T, ValidationFunction[]>>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  
  for (const [field, validations] of Object.entries(validationRules)) {
    if (validations && Array.isArray(validations)) {
      const value = formData[field as keyof T];
      const error = runValidations(String(value || ''), validations);
      if (error) {
        errors[field as keyof T] = error;
      }
    }
  }
  
  return errors;
};