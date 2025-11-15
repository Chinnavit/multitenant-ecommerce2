// storage-adapter-import-placeholder
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { multiTenantPlugin } from "@payloadcms/plugin-multi-tenant";

import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { isSuperAdmin } from "./lib/access";

import { Tags } from "./collections/Tags";
import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Orders } from "./collections/Orders";
import { Tenants } from "./collections/Tenants";
import { Reviews } from "./collections/Reviews";
import { Products } from "./collections/Products";
import { Categories } from "./collections/Categories";

import { Frames } from "./collections/Frames"; // <--- เพิ่มบรรทัดนี้
import { Mats } from "./collections/Mats";     // <--- เพิ่มบรรทัดนี้

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeNavLinks: [
        "@/components/stripe-verify#StripeVerify",
      ],
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Products,
    Tags,
    Tenants,
    Orders,
    Reviews,

    Frames,
    Mats,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || (() => { throw new Error("PAYLOAD_SECRET not found") })(),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || (() => { throw new Error("DATABASE_URI not found") })(),
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    multiTenantPlugin({
      collections: {
        products: {},
      },
      tenantsArrayField: {
        includeDefaultField: false,
      },
      userHasAccessToAllTenants: (user) => isSuperAdmin(user),
    }),
    // storage-adapter-placeholder
  ],
});
