import type { CollectionConfig } from "payload";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  admin: {
    useAsTitle: "clientName",
    defaultColumns: ["clientName", "company", "rating", "status", "createdAt"],
  },
  access: {
    read: () => true, // Publicly readable for portfolio visitors
    create: () => true, // Allows visitors to submit testimonials
  },
  fields: [
    {
      name: "clientName",
      type: "text",
      required: true,
    },
    {
      name: "clientRole",
      type: "text",
    },
    {
      name: "company",
      type: "text",
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: "reviewText",
      type: "textarea",
      required: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "approved",
      options: [
        { label: "Approved", value: "approved" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
      admin: {
        description: "Only approved reviews are displayed publicly on the portfolio.",
      },
    },
  ],
};
