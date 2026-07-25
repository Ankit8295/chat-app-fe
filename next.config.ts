import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "path";

const projectRoot = path.resolve(__dirname).replace(/\\/g, "/");

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: projectRoot,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
