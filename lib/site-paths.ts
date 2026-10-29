/** Prefix only portfolio destinations; assets, external URLs and local anchors stay intact. */
export function siteHref(href: string | undefined, basePath = '') {
  if (
    !href ||
    !basePath ||
    href === basePath ||
    href.startsWith(`${basePath}/`) ||
    href.startsWith(`${basePath}#`)
  )
    return href;
  if (href === '/' || href.startsWith('/#'))
    return `${basePath}${href.slice(1)}`;
  if (
    /^\/(?:about|activities|blog|work|write)(?:[/?#]|$)/.test(href) ||
    href === '/Mithul-Sourav-CV.pdf'
  )
    return `${basePath}${href}`;
  return href;
}
