import type { CollectionConfig } from "payload";

export const Skills: CollectionConfig = {
  slug: "skills",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: {
        description: "Category name e.g. Frontend Development, Backend & Systems",
      },
    },
    {
      name: "categoryIcon",
      type: "text",
      admin: {
        placeholder: "Layout, Server, Database, Wrench, Code2",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "skillsList",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "icon",
          type: "text",
          required: true,
          admin: {
            placeholder: "FaReact, SiNextdotjs, SiMongodb...",
          },
        },
        {
          name: "color",
          type: "text",
          admin: {
            placeholder: "#61DAFB, text-cyan-400...",
          },
        },
      ],
    },
  ],
};
