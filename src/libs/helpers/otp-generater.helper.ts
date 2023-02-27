import { randomInt } from 'crypto';

export const generateOTP = () => {
  const number = randomInt(10000, 99999);

  return number.toString();
};
