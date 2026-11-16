import type { CollectionConfig } from "payload";

export const Experiences: CollectionConfig = {
  slug: "experiences",
  admin: {
    useAsTitle: "company",
    defaultColumns: ["role", "company", "period", "order"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "company",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "text",
      required: true,
    },
    {
      name: "period",
      type: "text",
      required: true,
      admin: {
        placeholder: "2023 – Present",
      },
    },
    {
      name: "location",
      type: "text",
    },
    {
      name: "badge",
      type: "text",
      defaultValue: "Full-Time",
    },
    {
      name: "summary",
      type: "textarea",
    },
    {
      name: "responsibilities",
      type: "array",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "achievements",
      type: "array",
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
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
      name: "order",
      type: "number",
      defaultValue: 0,
    },
  ],
};
