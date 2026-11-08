import nextConfig from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  // `ampx sandbox` writes CDK build artifacts here; they are not our code.
  { ignores: [".amplify/**"] },
  ...nextConfig,
];

export default eslintConfig;
