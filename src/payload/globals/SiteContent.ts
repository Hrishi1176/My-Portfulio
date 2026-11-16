import type { GlobalConfig } from "payload";

export const SiteContent: GlobalConfig = {
  slug: "site-content",
  label: "Site Content & Sections",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ── Tab 1: Developer Profile & Identity ──
        {
          label: "Profile & Identity",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "name",
                  type: "text",
                  required: true,
                  admin: { width: "33%" },
                },
                {
                  name: "firstName",
                  type: "text",
                  admin: { width: "33%" },
                },
                {
                  name: "lastName",
                  type: "text",
                  admin: { width: "33%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "role",
                  type: "text",
                  required: true,
                  admin: { width: "50%" },
                },
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: { width: "50%" },
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "experienceYears",
                  type: "text",
                  required: true,
                  admin: { width: "25%" },
                },
                {
                  name: "email",
                  type: "email",
                  required: true,
                  admin: { width: "35%" },
                },
                {
                  name: "phone",
                  type: "text",
                  required: true,
                  admin: { width: "20%" },
                },
                {
                  name: "whatsapp",
                  type: "text",
                  required: true,
                  admin: { width: "20%" },
                },
              ],
            },
            {
              name: "location",
              type: "text",
              required: true,
            },
            {
              name: "socials",
              type: "group",
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "github",
                      type: "text",
                      defaultValue: "https://github.com/Hrishi1176",
                      admin: { width: "50%" },
                    },
                    {
                      name: "linkedin",
                      type: "text",
                      admin: { width: "50%" },
                    },
                  ],
                },
                {
                  type: "row",
                  fields: [
                    {
                      name: "instagram",
                      type: "text",
                      admin: { width: "50%" },
                    },
                    {
                      name: "facebook",
                      type: "text",
                      admin: { width: "50%" },
                    },
                  ],
                },
              ],
            },
          ],
        },

        // ── Tab 2: Hero Section ──
        {
          label: "Hero Section",
          fields: [
            {
              name: "availabilityBadge",
              type: "text",
              defaultValue: "Available for new opportunities",
              required: true,
            },
            {
              name: "tagline",
              type: "textarea",
              required: true,
            },
            {
              name: "stats",
              type: "array",
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
              ],
            },
            {
              name: "floatingBadges",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "color", type: "text", defaultValue: "from-cyan-500/20 to-blue-500/20" },
                { name: "border", type: "text", defaultValue: "border-cyan-400/30" },
                { name: "text", type: "text", defaultValue: "text-cyan-700 dark:text-cyan-300" },
                { name: "top", type: "text", defaultValue: "top-6" },
                { name: "left", type: "text", defaultValue: "-left-2" },
                { name: "delay", type: "number", defaultValue: 0 },
              ],
            },
            {
              name: "techStreams",
              type: "array",
              fields: [
                { name: "name", type: "text", required: true },
                { name: "tag", type: "text", required: true },
                { name: "speed", type: "text", required: true },
                { name: "color", type: "text", required: true },
              ],
            },
          ],
        },

        // ── Tab 3: About Section ──
        {
          label: "About Section",
          fields: [
            {
              name: "bioParagraphs",
              type: "array",
              fields: [
                {
                  name: "paragraph",
                  type: "textarea",
                  required: true,
                },
              ],
            },
            {
              name: "traits",
              type: "array",
              fields: [
                {
                  name: "trait",
                  type: "text",
                  required: true,
                },
              ],
            },
            {
              name: "focusAreas",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "icon", type: "text", defaultValue: "Cpu" },
                { name: "color", type: "text" },
              ],
            },
          ],
        },

        // ── Tab 4: Contact & Inquiries ──
        {
          label: "Contact Options",
          fields: [
            {
              name: "subjectOptions",
              type: "array",
              fields: [
                { name: "subject", type: "text", required: true },
              ],
            },
            {
              name: "budgetRanges",
              type: "array",
              fields: [
                { name: "value", type: "text", required: true },
                { name: "label", type: "text", required: true },
              ],
            },
          ],
        },

        // ── Tab 5: AI Assistant & Navigation ──
        {
          label: "AI & Navigation",
          fields: [
            {
              name: "aiChat",
              type: "group",
              fields: [
                { name: "maxDailyChats", type: "number", defaultValue: 10 },
                { name: "maxDailyRefinements", type: "number", defaultValue: 5 },
                {
                  name: "suggestedPrompts",
                  type: "array",
                  fields: [
                    { name: "prompt", type: "text", required: true },
                  ],
                },
              ],
            },
            {
              name: "navigation",
              type: "array",
              fields: [
                { name: "name", type: "text", required: true },
                { name: "href", type: "text", required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
};
