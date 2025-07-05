export function slugify(text: string): string {
  return text
    .toLowerCase() // convert to lowercase
    .trim() // remove whitespace from both ends
    .replace(/[^\w\s-]/g, "") // remove non-word characters (except spaces/hyphens)
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/--+/g, "-"); // collapse multiple hyphens
}
