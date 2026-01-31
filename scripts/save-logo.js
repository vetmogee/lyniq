const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function saveLogo() {
  try {
    // Read the SVG file
    const logoPath = path.join(__dirname, '..', 'public', 'lyniq.svg');
    
    if (!fs.existsSync(logoPath)) {
      console.error(`Error: Logo file not found at ${logoPath}`);
      process.exit(1);
    }

    const svgContent = fs.readFileSync(logoPath);
    const base64Data = svgContent.toString('base64');
    
    // Create JSON string with image data (same format as Image model)
    const imageDataJson = JSON.stringify({
      data: base64Data,
      mimeType: 'image/svg+xml',
      filename: 'lyniq.svg',
    });

    // Check if logo already exists
    const existingLogos = await prisma.logo.findMany();
    
    if (existingLogos.length > 0) {
      // Update the first logo (there should only be one)
      const logo = await prisma.logo.update({
        where: { id: existingLogos[0].id },
        data: {
          data: imageDataJson,
          mimeType: 'image/svg+xml',
          filename: 'lyniq.svg',
        },
      });
      console.log(`✓ Logo updated successfully (ID: ${logo.id})`);
    } else {
      // Create new logo
      const logo = await prisma.logo.create({
        data: {
          data: imageDataJson,
          mimeType: 'image/svg+xml',
          filename: 'lyniq.svg',
        },
      });
      console.log(`✓ Logo saved successfully (ID: ${logo.id})`);
    }

    console.log('Logo data saved to database');
  } catch (error) {
    console.error('Error saving logo:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

saveLogo();
