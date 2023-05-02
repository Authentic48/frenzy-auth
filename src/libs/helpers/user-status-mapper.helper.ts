import { Status as PrismaUserStatus } from '@prisma/client';
import { EUserStatus as TSUserStatus } from '@tintok/tintok-common';

export const mapUserStatus = (status: PrismaUserStatus) => {
  if (status !== PrismaUserStatus.ACTIVE) return TSUserStatus.BLOCKED;

  return TSUserStatus.ACTIVE;
};
