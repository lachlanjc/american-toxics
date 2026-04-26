import { defineConfig } from "oxlint";

import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";

export default defineConfig({
  extends: [
    core,
    next,
  ],
});
