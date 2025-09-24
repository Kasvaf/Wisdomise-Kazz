export const openInNewTab = (e: React.MouseEvent, url?: string) => {
  e.preventDefault();

  let finalUrl = url;

  const target = e.target as HTMLElement;
  const anchor = target.closest('a');

  if (!finalUrl && anchor) {
    finalUrl = anchor.href;
  }

  window.open(finalUrl, '_blank');
};
