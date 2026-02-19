export function isDatabaseUrlLikelyValid() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;

  const placeholders = ["[YOUR-PASSWORD]", "<PASSWORD>", "YOUR_PASSWORD", "password"];
  if (placeholders.some((placeholder) => url.includes(placeholder))) return false;

  try {
    const parsed = new URL(url);
    if (!["postgres:", "postgresql:"].includes(parsed.protocol)) return false;
    if (!parsed.hostname) return false;
    if (!parsed.username) return false;
    if (!parsed.password) return false;
    if (!parsed.pathname || parsed.pathname === "/") return false;
    return true;
  } catch {
    return false;
  }
}
