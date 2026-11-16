import type { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
  slug: "projects",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "featured", "isPrivate", "stars", "updatedAt"],
  },
  access: {
    read: () => true, // Publicly readable for portfolio visitors
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "number",
      type: "text",
      admin: {
        placeholder: "01",
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "isPrivate",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "stars",
      type: "number",
      defaultValue: 0,
    },
    {
      name: "github",
      type: "text",
    },
    {
      name: "live",
      type: "text",
    },
    {
      name: "tech",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "language",
      type: "text",
    },
    {
      name: "gradient",
      type: "text",
      defaultValue: "from-purple-600/20 via-indigo-600/20 to-blue-600/20",
    },
    {
      name: "tagColor",
      type: "text",
      defaultValue: "text-purple-600 dark:text-purple-300 border-purple-500/30",
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Display priority order (ascending)",
      },
    },
  ],
};
