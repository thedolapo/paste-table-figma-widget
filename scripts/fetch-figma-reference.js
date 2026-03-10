/**
 * Fetches table reference node from Figma and prints layout/styling specs.
 * Requires FIGMA_ACCESS_TOKEN in the environment. Do not commit the token.
 *
 * Usage: FIGMA_ACCESS_TOKEN=your_token node scripts/fetch-figma-reference.js
 */
const FILE_KEY = "KpHGoivAFKVQSkKyWGI7zb";
const NODE_ID = "106:3031";

async function main() {
  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error("Set FIGMA_ACCESS_TOKEN in the environment.");
    process.exit(1);
  }

  const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(NODE_ID)}`;
  const res = await fetch(url, {
    headers: { "X-Figma-Token": token },
  });

  if (!res.ok) {
    console.error("Figma API error:", res.status, await res.text());
    process.exit(1);
  }

  const data = await res.json();
  const node = data?.nodes?.[NODE_ID]?.document;
  if (!node) {
    console.error("Node not found.");
    process.exit(1);
  }

  // Extract layout-relevant fields for table styling
  const out = {
    name: node.name,
    type: node.type,
    absoluteBoundingBox: node.absoluteBoundingBox,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    itemSpacing: node.itemSpacing,
    layoutMode: node.layoutMode,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    fills: node.fills,
    strokes: node.strokes,
    children: (node.children || []).map((child) => ({
      id: child.id,
      name: child.name,
      type: child.type,
      absoluteBoundingBox: child.absoluteBoundingBox,
      paddingLeft: child.paddingLeft,
      paddingRight: child.paddingRight,
      paddingTop: child.paddingTop,
      paddingBottom: child.paddingBottom,
      itemSpacing: child.itemSpacing,
      layoutMode: child.layoutMode,
      fills: child.fills,
      strokes: child.strokes,
      childCount: child.children?.length ?? 0,
    })),
  };

  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
