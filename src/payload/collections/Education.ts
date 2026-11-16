import type { CollectionConfig } from "payload";

export const Education: CollectionConfig = {
  slug: "education",
  admin: {
    useAsTitle: "degree",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "degree",
      type: "text",
      required: true,
    },
    {
      name: "field",
      type: "text",
    },
    {
      name: "institution",
      type: "text",
      required: true,
    },
    {
      name: "period",
      type: "text",
    },
    {
      name: "score",
      type: "text",
    },
    {
      name: "highlights",
      type: "array",
      fields: [
        {
          name: "item",
          type: "text",
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
