#!/bin/zsh

rm -rf lib/svg/states
rm -rf lib/icons/states

# Download the SVG files from the GitHub repository
bun x github-download-directory jomurgel/state-svg-defs SVG
mv SVG lib/svg/states
# rm -rf SVG

# Convert to React components
bun x @svgr/cli --typescript --no-index --svgo-config='{"plugins":[{"name":"preset-default","params":{"overrides":{"removeViewBox":false}}}]}' --replace-attr-values none=currentColor --out-dir lib/icons/states/ lib/svg/states/

# Make component filenames uppercase
# Generate an index.ts exporting all uppercase components
{
  for f in lib/icons/states/*.tsx; do
    name=$(basename "$f" .tsx)
    lower=$(echo "$name" | tr '[:upper:]' '[:lower:]')
    upper=$(echo "$lower" | tr '[:lower:]' '[:upper:]')
    mv "$f" "lib/icons/states/$upper.tsx"
    printf 'export { default as %s } from "./%s";\n' "$upper" "$upper"
  done
} > lib/icons/states/index.ts
