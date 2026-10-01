import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "price", title: "Price (EGP)", type: "number", validation: (r) => r.required().min(1) }),
    defineField({ name: "image", type: "image", options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "text" }),
    defineField({ name: "sizes", type: "array", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "inStock", title: "In stock", type: "boolean", initialValue: true }),
  ],
});
