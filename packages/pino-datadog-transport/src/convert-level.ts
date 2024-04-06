export const convertLevel = (level: number | string): string => {
  if (typeof level === "string") {
    return level;
  }

  if (level >= 60) {
    return "fatal";
  }
  if (level >= 50) {
    return "error";
  }
  if (level >= 40) {
    return "warning";
  }
  if (level >= 30) {
    return "info";
  }
  if (level >= 20) {
    return "debug";
  }

  return "trace";
};
