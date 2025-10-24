# Logo Instructions

## Current Status

The repository currently contains SVG placeholder logos with "CLA" text. These need to be replaced with the actual Quaxis Clarus token logo.

## The Actual Logo

The actual $CLA token logo was provided in the project setup. It should be:
- A professional, high-quality image representing the Quaxis Clarus brand
- Suitable for use in various contexts (website, documentation, social media)
- Clear and recognizable at different sizes

## What to Do

1. **Locate the actual logo image** that was provided in the project setup
2. **Save it as `logo.png`** in this directory (site/assets/)
3. **Create variants:**
   - `logo-512.png` - 512x512 pixel version
   - `logo-256.png` - 256x256 pixel version
4. **Optional:** Generate a `favicon.ico` from the logo for the website

## Image Specifications

- **Format:** PNG with transparency preferred
- **Dimensions:** At least 512x512 pixels for the main logo
- **File size:** Optimized for web (under 200KB recommended)
- **Background:** Transparent or solid color that works on both light and dark backgrounds

## Tools for Resizing

If you need to create the variants:
- **ImageMagick:** `convert logo.png -resize 512x512 logo-512.png`
- **Online tools:** TinyPNG, Squoosh, or similar
- **Design software:** Photoshop, GIMP, Figma, etc.

## After Replacing

Once you replace the logos:
1. Delete or update this instruction file
2. Test the website locally to ensure logos display correctly
3. Commit and push the changes
4. The GitHub Pages workflow will automatically deploy the updated site

## Current Placeholder

The current SVG placeholder (`logo.svg`) was created as a temporary solution and shows:
- A circular gradient background (blue)
- "CLA" text in white

This is NOT the final logo and should be replaced before production deployment.
