export function parseUrl(url: string): string {
  if (
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
      url
    )
  ) {
    return url;
  }

  return `http://localhost:8080/media/${url}`;
}
