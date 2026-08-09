export function buildShortcutRunUrl({ name, urls, callbackUrl }) {
  if (!Array.isArray(urls) || urls.length === 0) {
    throw new Error('at least one URL is required');
  }
  const params = new URLSearchParams({
    name,
    input: 'text',
    text: urls.join('\n'),
    'x-success': callbackUrl
  });
  return `shortcuts://x-callback-url/run-shortcut?${params.toString()}`;
}
