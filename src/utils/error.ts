export function unwrapErrorMessage(e: any) {
  return e.response?.data?.message || e.message || '';
}

export function extractWagmiErrorMessage(message: string) {
  if (isUserRejectionError(message)) {
    return message.split('.')[0];
  }
  return message;
}

export function isUserRejectionError(message: string) {
  return message.startsWith('User rejected');
}
