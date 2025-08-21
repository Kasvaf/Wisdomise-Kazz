export const truncateUserId = (userId: string) =>
  `${userId.slice(0, 4)}...${userId.slice(-4)}`;
