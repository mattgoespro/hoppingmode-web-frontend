import { merge } from "webpack-merge";
import baseConfig from "./webpack.common";

export default merge(baseConfig, {
  mode: "production",
  devtool: "inline-source-map",
  performance: {
    hints: "warning",
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
});
