#!/usr/bin/env ts-node

import fs from "fs";
import path from "path";

// Get module name from CLI
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Please provide a module name. Example: npm run generate:user user");
  process.exit(1);
}

const moduleName = args[0];
const moduleFolder = path.join(__dirname, "src", "app", "modules", moduleName);

// Ensure folder exists
if (!fs.existsSync(moduleFolder)) {
  fs.mkdirSync(moduleFolder, { recursive: true });
}

// File templates
const templates: { [key: string]: string } = {
  [`${moduleName}.interface.ts`]: `export interface I${capitalize(moduleName)} {\n  // define fields\n}\n`,
  [`${moduleName}.model.ts`]: `import { Schema, model } from "mongoose";\nimport { I${capitalize(moduleName)} } from "./${moduleName}.interface";\n\nconst ${moduleName}Schema = new Schema<I${capitalize(moduleName)}>({\n});\n\nexport const ${capitalize(moduleName)}Model = model<I${capitalize(moduleName)}>("${capitalize(moduleName)}", ${moduleName}Schema);\n`,
  [`${moduleName}.controller.ts`]: `import { Request, Response } from "express";\nexport class ${capitalize(moduleName)}Controller {\n  // define controller methods\n}\n`,
  [`${moduleName}.service.ts`]: `export class ${capitalize(moduleName)}Service {\n  // define service methods\n}\n`,
  [`${moduleName}.route.ts`]: `import { Router } from "express";\nimport { ${capitalize(moduleName)}Controller } from "./${moduleName}.controller";\n\nconst router = Router();\nconst controller = new ${capitalize(moduleName)}Controller();\n\n// define routes\nexport default router;\n`,
};

// Helper function
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Create files
for (const [fileName] of Object.entries(templates)) {
  const filePath = path.join(moduleFolder, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "");
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️ Already exists: ${filePath}`);
  }
}
