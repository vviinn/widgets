#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const DOCS_JSON = path.join(__dirname, "../../docs.json");
const LLMS_DIR = path.join(__dirname, "../storybook-static/llms");

// Component name mapping: playground file prefix -> component tag
const COMPONENT_MAPPING = {
  "playground-search-modal": "vviinn-vps-button",
  "playground-search-bar": "vviinn-text-search",
  "playground-cropper": "vviinn-cropper",
  "playground-product-card": "vviinn-product-card",
  "playground-product-list": "vviinn-results",
  "playground-discovery": "vviinn-vpr-widget",
  "playground-one-click-discovery": "vviinn-vpr-button",
  "playground-shop-the-look": "vviinn-shop-the-look",
};

console.log("📝 Enriching LLM docs with Stencil docs.json...\n");

// Read and validate docs.json, return components indexed by tag name
function readDocsJson() {
  if (!fs.existsSync(DOCS_JSON)) {
    console.error(`❌ docs.json not found at ${DOCS_JSON}`);
    console.error("   Run 'npm run build' first to generate docs.json");
    process.exit(1);
  }

  try {
    const content = fs.readFileSync(DOCS_JSON, "utf-8");
    const data = JSON.parse(content);

    const componentsByTag = {};
    (data.components || []).forEach((comp) => {
      componentsByTag[comp.tag] = comp;
    });

    if (Object.keys(componentsByTag).length === 0) {
      console.error(`❌ docs.json contains no components`);
      process.exit(1);
    }

    return componentsByTag;
  } catch (error) {
    console.error(`❌ Could not read ${DOCS_JSON}:`, error.message);
    process.exit(1);
  }
}

const ENRICHMENT_MARKER = "<!-- STENCIL_DOCS_ENRICHED -->";

// Convert component metadata (props, slots, CSS vars, parts) to Markdown
function componentToMarkdown(component) {
  if (!component) return "";

  let md = ENRICHMENT_MARKER + "\n\n";

  // Properties section
  if (component.props && component.props.length > 0) {
    md += `## Properties\n\n`;
    md += `Component: \`<${component.tag}>\`\n\n`;

    component.props.forEach((prop) => {
      const optional = prop.optional || !prop.required ? " (optional)" : "";
      const htmlAttr = prop.attr || prop.name;

      md += `### \`${htmlAttr}\`${optional}\n\n`;

      if (prop.docs) {
        md += `${prop.docs}\n\n`;
      }

      md += `**Type:** \`${prop.type}\`\n\n`;

      if (prop.default && prop.default !== "undefined") {
        md += `**Default:** \`${prop.default}\`\n\n`;
      }
    });
  }

  // Slots section
  if (component.slots && component.slots.length > 0) {
    md += `## Slots\n\n`;

    component.slots.forEach((slot) => {
      md += `### \`${slot.name}\`\n\n`;

      if (slot.docs) {
        md += `${slot.docs}\n\n`;
      }
    });
  }

  // CSS Custom Properties section
  if (component.styles && component.styles.length > 0) {
    md += `## CSS Custom Properties\n\n`;

    component.styles.forEach((style) => {
      md += `### \`${style.name}\`\n\n`;

      if (style.docs) {
        md += `${style.docs}\n\n`;
      }

      if (style.annotation === "prop") {
        md += `**Type:** CSS property\n\n`;
      }
    });
  }

  // Shadow Parts section
  if (component.parts && component.parts.length > 0) {
    md += `## CSS Shadow Parts\n\n`;
    md += `Use \`::part(name)\` to style these elements.\n\n`;

    component.parts.forEach((part) => {
      md += `### \`${part.name}\`\n\n`;

      if (part.docs) {
        md += `${part.docs}\n\n`;
      }
    });
  }

  return md;
}

// Enrich playground-*.txt files with matching component metadata
function enrichLlmsFiles(componentsByTag) {
  if (!fs.existsSync(LLMS_DIR)) {
    console.error(`❌ LLMS directory not found at ${LLMS_DIR}`);
    console.error("   Make sure storybook-llms-extractor ran successfully");
    process.exit(1);
  }

  const llmsFiles = fs.readdirSync(LLMS_DIR).filter((f) => f.endsWith(".txt"));

  if (llmsFiles.length === 0) {
    console.warn(`⚠️  No .txt files found in ${LLMS_DIR}`);
  }

  let enrichedCount = 0;

  llmsFiles.forEach((fileName) => {
    if (!fileName.startsWith("playground-")) return;

    const filePath = path.join(LLMS_DIR, fileName);
    let content = fs.readFileSync(filePath, "utf-8");

    if (content.includes(ENRICHMENT_MARKER)) {
      console.log(`  ⊘ Skipped ${fileName} (already enriched)`);
      return;
    }

    // Find matching component
    let component = null;
    for (const [prefix, tagName] of Object.entries(COMPONENT_MAPPING)) {
      if (fileName.includes(prefix)) {
        component = componentsByTag[tagName];
        break;
      }
    }

    if (!component) {
      return;
    }

    // Add metadata sections at the top (after title)
    const markdown = componentToMarkdown(component);
    const lines = content.split("\n");

    // Insert after title (line 0 = "# Title", insert at line 1)
    lines.splice(1, 0, "", markdown.trim(), "");
    content = lines.join("\n");

    fs.writeFileSync(filePath, content, "utf-8");
    enrichedCount++;

    const sections = [];
    if (component.props?.length)
      sections.push(`${component.props.length} props`);
    if (component.slots?.length)
      sections.push(`${component.slots.length} slots`);
    if (component.styles?.length)
      sections.push(`${component.styles.length} CSS vars`);
    if (component.parts?.length)
      sections.push(`${component.parts.length} parts`);

    console.log(
      `  ✓ ${fileName} with ${component.tag} (${sections.join(", ")})`,
    );
  });

  return enrichedCount;
}

// Enrich components-filters.txt with vviinn-filters + vviinn-extended-filters
// @param {Record<string, any>} componentsByTag - Components indexed by tag
// @returns {number} 1 if enriched, 0 if skipped
function enrichFiltersFile(componentsByTag) {
  const fileName = "components-filters.txt";
  const filePath = path.join(LLMS_DIR, fileName);

  if (!fs.existsSync(filePath)) {
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf-8");

  // Check if already enriched
  if (content.includes(ENRICHMENT_MARKER)) {
    console.log(`  ⊘ Skipped ${fileName} (already enriched)`);
    return 0;
  }

  // Get both filter components
  const filters = componentsByTag["vviinn-filters"];
  const extendedFilters = componentsByTag["vviinn-extended-filters"];

  if (!filters && !extendedFilters) {
    return 0;
  }

  let markdown = "";
  if (filters) markdown += componentToMarkdown(filters);
  if (extendedFilters) markdown += componentToMarkdown(extendedFilters);

  // Find insertion point - before "## Examples" or "### " section
  const lines = content.split("\n");
  let insertIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## Examples") || lines[i].startsWith("### ")) {
      insertIndex = i;
      break;
    }
  }

  // If no Examples/### found, append at the end
  if (insertIndex === -1) {
    insertIndex = lines.length;
  }

  // Insert the metadata
  lines.splice(insertIndex, 0, "", markdown.trim(), "");
  content = lines.join("\n");

  fs.writeFileSync(filePath, content, "utf-8");

  const sections = [];
  if (filters) sections.push("vviinn-filters");
  if (extendedFilters) sections.push("vviinn-extended-filters");

  console.log(`  ✓ ${fileName} with ${sections.join(", ")}`);
  return 1;
}

// Main
try {
  const componentsByTag = readDocsJson();
  const componentCount = Object.keys(componentsByTag).length;
  console.log(`📦 Loaded ${componentCount} components from docs.json\n`);

  const enrichedCount = enrichLlmsFiles(componentsByTag);
  const filtersEnriched = enrichFiltersFile(componentsByTag);

  const totalEnriched = enrichedCount + filtersEnriched;

  console.log(
    `\n✅ Done! Enriched ${totalEnriched} files with complete metadata\n`,
  );
} catch (error) {
  console.error("❌ Error:", error.message);
  console.error(error.stack);
  process.exit(1);
}
