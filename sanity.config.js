import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import product from "./src/sanity/product";

export default defineConfig({
  name: "default",
  title: "Store",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  basePath: "/studio",
  plugins: [structureTool()],
  schema: { types: [product] },
});
