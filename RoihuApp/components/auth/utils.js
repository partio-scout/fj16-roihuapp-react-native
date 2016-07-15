'use strict';

export function parseCredentials(url) {
  const matchRoihuScheme = /roihu:\/\/([^\/]*)\/([^\/]*)/.exec(url);
  if (matchRoihuScheme)
    return matchRoihuScheme.slice(1);
  const matchHttpScheme = /.*emailredirect\/([^\/]*)\/([^\/]*)/.exec(url);
  if (matchHttpScheme)
    return matchHttpScheme.slice(1);
  return [];
}
