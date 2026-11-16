import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";

import { Users } from "./payload/collections/Users";
import { Projects } from "./payload/collections/Projects";
import { Experiences } from "./payload/collections/Experiences";
import { Skills } from "./payload/collections/Skills";
import { Education } from "./payload/collections/Education";
import { Reviews } from "./payload/collections/Reviews";
import { Robots } from "./payload/collections/Robots";
import { SiteContent } from "./payload/globals/SiteContent";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    suppressHydrationWarning: true,
  },
  collections: [Users, Projects, Experiences, Skills, Education, Reviews, Robots],
  globals: [SiteContent],
  editor: lexicalEditor(),
  secret:
    process.env.PAYLOAD_SECRET ||
    "portfolio-payload-secret-key-32-characters-minimum-for-security",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio",
  }),
});
