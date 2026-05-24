import base from "./base.js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...base,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react: (await import("eslint-plugin-react")).default,
      "react-hooks": (await import("eslint-plugin-react-hooks")).default,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...((await import("eslint-plugin-react-hooks")).default.configs.recommended
        .rules ?? {}),
      "react/react-in-jsx-scope": "off",
    },
  },
];
