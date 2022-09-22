export default {
  passWithNoTests: true,
  moduleDirectories: ["node_modules"],
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
};
