import { $ } from "bun";
import { env } from "@/env";
await $`echo "Initailizing codegen"`;

await $`bunx @better-auth/cli generate --config src/auth/index.ts`;
