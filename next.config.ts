import type { NextConfig } from "next";
import type { Configuration, Compiler, Compilation } from "webpack";

const nextConfig: NextConfig = {
  webpack: (config: Configuration) => {
    config.plugins?.push({
      apply(compiler: Compiler) {
        compiler.hooks.emit.tapAsync("DetectLargeStringsPlugin", (compilation: Compilation, callback: () => void) => {
          const THRESHOLD = 100 * 1024; // 100 KB

          for (const filename in compilation.assets) {
            const asset = compilation.assets[filename];
            const source = asset.source();

            if (typeof source === "string" && source.length > THRESHOLD) {
              console.warn(
                `[LargeStringWarning] "${filename}" is ${(source.length / 1024).toFixed(1)} KB`
              );
            }
          }

          callback();
        });
      },
    });

    return config;
  },
};

export default nextConfig;
