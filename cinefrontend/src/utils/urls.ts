import { BASE_URL } from "../app";

export function parseUrl(url: string): string {
  if (!url) {
    return '';
  }

  if (
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      url
    )
  ) {
    return url;
  }

  if (url.startsWith('data:')) {
    return url;
  }

  return `${BASE_URL}/media/${url}/`;
}
