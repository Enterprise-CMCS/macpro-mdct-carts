module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current",
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
          esmodules: true,
        },
      },
    ],
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
};
