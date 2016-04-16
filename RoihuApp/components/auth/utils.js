'use strict';

export function parseCredentials(url) {
  const match = /roihu:\/\/([^\/]*)\/([^\/]*)/.exec(url);
  if (match)
    return match.slice(1);
  return [];
}
