// Shared visual encoding for earthquake depth.
// Keep the same depth color scale in the 3D globe and the UI panel.
const DEPTH_COLORS = {
  shallow: "#22c55e",
  intermediate: "#fb923c",
  deep: "#ef4444",
} as const;

type DepthLevel = keyof typeof DEPTH_COLORS;

export const getDepthLevel = (depth: number): DepthLevel => {
  if (depth < 30) return "shallow";
  if (depth < 100) return "intermediate";
  return "deep";
};

export const getDepthColor = (depth: number) =>
  DEPTH_COLORS[getDepthLevel(depth)];
