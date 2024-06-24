export const truncateUserId = (userId: string) =>
  userId.slice(0, 8) + '...' + userId.slice(-6);
