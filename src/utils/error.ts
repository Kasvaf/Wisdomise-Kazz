export function unwrapErrorMessage(e: any) {
  return e.response?.data.message || e.message || '';
}

export function extractWagmiErrorMessage(message: string) {
  if (message.startsWith('User rejected')) {
    return message.split('.')[0];
  }
  return message;
}
