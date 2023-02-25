import crypto from 'crypto';

export const generateOTP = (): number => {
  return crypto.randomInt(5);
};
