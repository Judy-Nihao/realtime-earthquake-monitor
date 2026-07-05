// Shared visual encoding for earthquake depth.
// Keep the same depth color scale in the 3D globe and the UI panel.
export const getDepthColor = (depth: number) => {
  if (depth < 30) return "#facc15";
  if (depth < 100) return "#fb923c";
  return "#ef4444";
};
