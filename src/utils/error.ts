export function unwrapErrorMessage(e: any) {
  return (
    e.response?.data?.message ||
    e.response?._data?.message ||
    e.response?.statusMessage ||
    e.message ||
    ''
  );
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
