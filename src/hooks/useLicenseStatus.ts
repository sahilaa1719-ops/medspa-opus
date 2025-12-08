import { differenceInDays } from 'date-fns';

export type LicenseStatus = 'valid' | 'expiring' | 'expired';

export const useLicenseStatus = () => {
  const getLicenseStatus = (expiryDate: Date): LicenseStatus => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysRemaining = differenceInDays(expiry, today);

    if (daysRemaining < 0) return 'expired';
    if (daysRemaining <= 30) return 'expiring';
    return 'valid';
  };

  const getDaysRemaining = (expiryDate: Date): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    return differenceInDays(expiry, today);
  };

  const getExpirationText = (expiryDate: Date): string => {
    const days = getDaysRemaining(expiryDate);
    
    if (days < 0) {
      return `Expired ${Math.abs(days)} days ago`;
    }
    if (days === 0) {
      return 'Expires today';
    }
    if (days === 1) {
      return 'Expires tomorrow';
    }
    return `Expires in ${days} days`;
  };

  return { getLicenseStatus, getDaysRemaining, getExpirationText };
};
