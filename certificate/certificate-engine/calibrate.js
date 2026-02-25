/**
 * Calibration Script
 * Draws a red grid over your template to help identify exact coordinates
 * Run: node calibrate.js
 */

const { createCanvas, loadImage } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// Template to calibrate (change this to test different templates)
const TEMPLATE_TO_TEST = './assets/templates/silver.jpg';
const OUTPUT_FILE = './output/CALIBRATION_GRID.jpg';

async function createGrid() {
    console.log('🔧 Starting calibration...\n');
    
    // Ensure output directory exists
    if (!fs.existsSync('./output')) {
        fs.mkdirSync('./output', { recursive: true });
    }
    
    // Check if template exists
    if (!fs.existsSync(TEMPLATE_TO_TEST)) {
        console.error(`❌ Template not found: ${TEMPLATE_TO_TEST}`);
        console.log('\nAvailable templates:');
        const templatesDir = './assets/templates';
        if (fs.existsSync(templatesDir)) {
            fs.readdirSync(templatesDir).forEach(file => {
                console.log(`   • ${file}`);
            });
        }
        return;
    }
    
    // Load template
    console.log(`📄 Loading template: ${TEMPLATE_TO_TEST}`);
    const image = await loadImage(TEMPLATE_TO_TEST);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    
    console.log(`📐 Template dimensions: ${image.width} x ${image.height}px\n`);

    // 1. Draw Template
    ctx.drawImage(image, 0, 0);

    // 2. Draw Helper Grid
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'red';
    ctx.font = 'bold 24px Arial';

    // Draw Horizontal Lines (Y-Axis) every 100px
    for (let y = 0; y < image.height; y += 100) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(image.width, y);
        ctx.stroke();
        ctx.fillText(`Y=${y}`, 20, y - 5);
    }

    // Draw Vertical Lines (X-Axis) every 100px
    for (let x = 0; x < image.width; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, image.height);
        ctx.stroke();
        // Stagger labels to avoid overlap
        const labelY = (x % 200 === 0) ? 30 : 60;
        ctx.fillText(`X=${x}`, x + 5, labelY);
    }

    // 3. Draw key reference points with larger markers (current CONFIG values)
    ctx.fillStyle = 'blue';
    ctx.font = 'bold 28px Arial';
    
    const keyYPositions = [
        { y: 750, label: 'nameStartY (CURRENT - too high?)' },
        { y: 1000, label: 'nameStartY (suggested)' },
        { y: 1050, label: 'sportY' },
        { y: 1200, label: 'orgY' },
        { y: 1280, label: 'assocY' },
        { y: 1360, label: 'dateFromY' },
        { y: 1440, label: 'dateToY' }
    ];
    
    keyYPositions.forEach(pos => {
        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);
        ctx.moveTo(0, pos.y);
        ctx.lineTo(image.width, pos.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillText(`← ${pos.label}`, 200, pos.y - 8);
    });

    // 4. Save
    const buffer = canvas.toBuffer('image/jpeg', { quality: 95 });
    fs.writeFileSync(OUTPUT_FILE, buffer);
    
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║              CALIBRATION COMPLETE                          ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n✅ Grid saved to: ${path.resolve(OUTPUT_FILE)}`);
    console.log('\n📋 Instructions:');
    console.log('   1. Open the generated image');
    console.log('   2. Find where your form fields should start');
    console.log('   3. Note the X and Y coordinates from the grid');
    console.log('   4. Update CONFIG in index.js with the correct values');
    console.log('\n💡 Tips:');
    console.log('   • RED lines = 100px intervals');
    console.log('   • BLUE dashed lines = current CONFIG positions');
    console.log('   • Look for where "First Name" text should appear');
    console.log('   • Look for where inline fields (Sport, Org, etc.) should go\n');
}

createGrid().catch(err => {
    console.error('💥 Error:', err.message);
});
