const fs = require("fs");
const path = require("path");

function generateExports(featurePath, featureName) {
  const folders = ["components", "lib", "schema", "types", "store", "constants"];
  const exports = [];

  folders.forEach((folder) => {
    const folderPath = path.join(featurePath, folder);
    if (!fs.existsSync(folderPath)) return;

    const files = fs.readdirSync(folderPath).filter((file) => {
      const isTs = file.endsWith(".ts") || file.endsWith(".tsx");
      const isNotIndex = file !== "index.ts" && file !== "index.tsx";
      const isNotGitkeep = !file.startsWith(".");
      return isTs && isNotIndex && isNotGitkeep;
    });

    files.forEach((file) => {
      const fileName = file.replace(/\.(ts|tsx)$/, "");
      exports.push(`export * from './${folder}/${fileName}';`);
    });
  });

  const indexPath = path.join(featurePath, "index.ts");
  const content =
    exports.length > 0
      ? exports.join("\n") + "\n"
      : "// No exports found — add modules under components/lib/schema/types\n";
  fs.writeFileSync(indexPath, content);
  console.log(`✓ Generated ${exports.length} exports for: ${featureName}`);
}

function generateAllFeatures(featuresPath) {
  if (!fs.existsSync(featuresPath)) return;
  const features = fs.readdirSync(featuresPath).filter((item) => {
    return fs.statSync(path.join(featuresPath, item)).isDirectory();
  });
  features.forEach((feature) => {
    generateExports(path.join(featuresPath, feature), feature);
  });
}

const defaultFeaturesPath = path.join(process.cwd(), "src/features");
const defaultAdminPath = path.join(process.cwd(), "src/admin");
generateAllFeatures(defaultFeaturesPath);
generateAllFeatures(defaultAdminPath);
