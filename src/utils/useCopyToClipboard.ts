import { useCallback, useState } from 'react';

export function useCopyToClipboard(duration = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        setTimeout(() => setCopied(false), duration);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        setError('Failed to copy');
        setCopied(false);
      }
    },
    [duration],
  );

  return { copied, error, copyToClipboard };
}
