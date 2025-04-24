const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Paths
const assetsDir = path.join(__dirname, '../assets');
const iconSvgPath = path.join(assetsDir, 'icon.svg');
const splashSvgPath = path.join(assetsDir, 'splash.svg');
const iconPngPath = path.join(assetsDir, 'icon.png');
const splashPngPath = path.join(assetsDir, 'splash.png');
const adaptiveIconPath = path.join(assetsDir, 'adaptive-icon.png');
const faviconPath = path.join(assetsDir, 'favicon.png');

// Convert icon.svg to icon.png (1024x1024)
async function convertIcon() {
  try {
    console.log('Converting icon.svg to icon.png...');
    await sharp(iconSvgPath)
      .resize(1024, 1024)
      .png()
      .toFile(iconPngPath);
    
    // Create adaptive-icon.png (1024x1024)
    console.log('Creating adaptive-icon.png...');
    await sharp(iconSvgPath)
      .resize(1024, 1024)
      .png()
      .toFile(adaptiveIconPath);
    
    // Create favicon.png (48x48)
    console.log('Creating favicon.png...');
    await sharp(iconSvgPath)
      .resize(48, 48)
      .png()
      .toFile(faviconPath);
    
    console.log('Icon conversion completed successfully!');
  } catch (error) {
    console.error('Error converting icon:', error);
  }
}

// Convert splash.svg to splash.png (2048x2048)
async function convertSplash() {
  try {
    console.log('Converting splash.svg to splash.png...');
    await sharp(splashSvgPath)
      .resize(2048, 2048)
      .png()
      .toFile(splashPngPath);
    
    console.log('Splash conversion completed successfully!');
  } catch (error) {
    console.error('Error converting splash:', error);
  }
}

// Run conversions
async function run() {
  await convertIcon();
  await convertSplash();
  console.log('All conversions completed!');
}

run();
