export function generateVerificationCode() {
  return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
}

export function extractTokenFromAuthHeader(authHeader: string) {
  return authHeader.replace("Bearer ", "");
}

export function parseTokenExpTimeToMs(expTime: string): number {
  if (expTime.includes("d")) {
    return parseFloat(expTime) * 24 * 60 * 60 * 1000;
  }

  return parseFloat(expTime) * 60 * 1000;
}
