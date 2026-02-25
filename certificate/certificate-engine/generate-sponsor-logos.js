const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// Professional sponsor logo configurations with different shapes
const sponsors = [
    { name: 'TechCorp', color1: '#3498db', color2: '#2980b9', file: 'techcorp.png', shape: 'circle' },
    { name: 'Innovation\nLabs', color1: '#e74c3c', color2: '#c0392b', file: 'innovation_labs.png', shape: 'square' },
    { name: 'Digital\nFuture', color1: '#2ecc71', color2: '#27ae60', file: 'digital_future.png', shape: 'rounded-square' },
    { name: 'Brain\nPower', color1: '#9b59b6', color2: '#8e44ad', file: 'brainpower.png', shape: 'hexagon' },
    { name: 'Strategic\nMinds', color1: '#f39c12', color2: '#e67e22', file: 'strategic_minds.png', shape: 'rectangle' },
    { name: 'AquaTech', color1: '#1abc9c', color2: '#16a085', file: 'aquatech.png', shape: 'circle' },
    { name: 'Water\nSports', color1: '#34495e', color2: '#2c3e50', file: 'watersports.png', shape: 'diamond' },
    { name: 'Marine', color1: '#16a085', color2: '#1abc9c', file: 'marine.png', shape: 'rounded-square' },
    { name: 'Sports\nAuth', color1: '#c0392b', color2: '#e74c3c', file: 'sports_auth.png', shape: 'shield' },
    { name: 'Football\nFed', color1: '#27ae60', color2: '#2ecc71', file: 'football_fed.png', shape: 'pentagon' },
    { name: 'Athletic\nGear', color1: '#2980b9', color2: '#3498db', file: 'athletic_gear.png', shape: 'star' },
    { name: 'Campus\nSports', color1: '#8e44ad', color2: '#9b59b6', file: 'campus_sports.png', shape: 'circle' },
    { name: 'Tennis\nExcel', color1: '#d35400', color2: '#e67e22', file: 'tennis_excellence.png', shape: 'ellipse' },
    { name: 'Racket\nMasters', color1: '#c0392b', color2: '#e74c3c', file: 'racket_masters.png', shape: 'octagon' },
    { name: 'Target\nPro', color1: '#16a085', color2: '#1abc9c', file: 'target_pro.png', shape: 'triangle' },
    { name: 'Paddle\nChamps', color1: '#2c3e50', color2: '#34495e', file: 'paddle_champs.png', shape: 'square' },
    { name: 'TableTech', color1: '#e67e22', color2: '#d35400', file: 'tabletech.png', shape: 'rounded-rectangle' },
    { name: 'VolleyPro', color1: '#3498db', color2: '#2980b9', file: 'volleypro.png', shape: 'hexagon' }
];

const outputDir = path.join(__dirname, 'assets', 'sponsors');
const CANVAS_SIZE = 250;  // Increased from 150 for more professional look
const CENTER = CANVAS_SIZE / 2;

/**
 * Create gradient fill
 */
function createGradient(ctx, x, y, radius, color1, color2) {
    const gradient = ctx.createRadialGradient(x, y - radius * 0.3, radius * 0.2, x, y, radius);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
}

/**
 * Draw shadow/glow effect
 */
function addShadowEffect(ctx, color, blur = 15) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
}

/**
 * Draw professional shapes with gradients
 */
function drawProfessionalShape(ctx, shape, centerX, centerY, size, color1, color2) {
    const gradient = createGradient(ctx, centerX, centerY, size, color1, color2);
    
    // Add shadow
    addShadowEffect(ctx, 'rgba(0, 0, 0, 0.3)', 20);
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    
    switch(shape) {
        case 'circle':
            ctx.beginPath();
            ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'square':
            const squareSize = size * 1.6;
            ctx.fillRect(centerX - squareSize/2, centerY - squareSize/2, squareSize, squareSize);
            ctx.shadowBlur = 0;
            ctx.strokeRect(centerX - squareSize/2, centerY - squareSize/2, squareSize, squareSize);
            break;
            
        case 'triangle':
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - size * 1.2);
            ctx.lineTo(centerX + size * 1.1, centerY + size * 0.6);
            ctx.lineTo(centerX - size * 1.1, centerY + size * 0.6);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'rectangle':
            const rectW = size * 2;
            const rectH = size * 1.2;
            ctx.fillRect(centerX - rectW/2, centerY - rectH/2, rectW, rectH);
            ctx.shadowBlur = 0;
            ctx.strokeRect(centerX - rectW/2, centerY - rectH/2, rectW, rectH);
            break;
            
        case 'rounded-rectangle':
            drawRoundedRect(ctx, centerX - size * 1.4, centerY - size * 0.8, size * 2.8, size * 1.6, 25);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'rounded-square':
            drawRoundedRect(ctx, centerX - size * 1.2, centerY - size * 1.2, size * 2.4, size * 2.4, 30);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'diamond':
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - size * 1.2);
            ctx.lineTo(centerX + size * 0.9, centerY);
            ctx.lineTo(centerX, centerY + size * 1.2);
            ctx.lineTo(centerX - size * 0.9, centerY);
            ctx.closePath();
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'hexagon':
            drawPolygon(ctx, centerX, centerY, size * 1.1, 6);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'pentagon':
            drawPolygon(ctx, centerX, centerY, size * 1.1, 5);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'octagon':
            drawPolygon(ctx, centerX, centerY, size * 1.1, 8);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'star':
            drawStar(ctx, centerX, centerY, size * 1.1, 5);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'shield':
            drawShield(ctx, centerX, centerY, size * 1.1);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        case 'ellipse':
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, size * 1.6, size * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
            break;
            
        default:
            ctx.beginPath();
            ctx.arc(centerX, centerY, size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.stroke();
    }
}

/**
 * Helper: Draw rounded rectangle
 */
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

/**
 * Helper: Draw regular polygon
 */
function drawPolygon(ctx, x, y, radius, sides) {
    ctx.beginPath();
    const angle = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2; // Start from top
    
    for (let i = 0; i <= sides; i++) {
        const a = startAngle + i * angle;
        const px = x + radius * Math.cos(a);
        const py = y + radius * Math.sin(a);
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
}

/**
 * Helper: Draw star
 */
function drawStar(ctx, x, y, radius, points) {
    const outerRadius = radius;
    const innerRadius = radius * 0.4;
    const angle = Math.PI / points;
    
    ctx.beginPath();
    for (let i = 0; i < 2 * points; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const a = i * angle - Math.PI / 2;
        const px = x + r * Math.cos(a);
        const py = y + r * Math.sin(a);
        if (i === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.closePath();
}

/**
 * Helper: Draw shield
 */
function drawShield(ctx, x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.7, y - size);
    ctx.quadraticCurveTo(x + size * 0.8, y - size, x + size * 0.8, y - size * 0.8);
    ctx.lineTo(x + size * 0.8, y + size * 0.3);
    ctx.quadraticCurveTo(x + size * 0.8, y + size * 0.8, x, y + size);
    ctx.quadraticCurveTo(x - size * 0.8, y + size * 0.8, x - size * 0.8, y + size * 0.3);
    ctx.lineTo(x - size * 0.8, y - size * 0.8);
    ctx.quadraticCurveTo(x - size * 0.8, y - size, x - size * 0.7, y - size);
    ctx.closePath();
}

/**
 * Add professional text with better typography
 */
function addProfessionalText(ctx, text, centerX, centerY) {
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    
    // Text with subtle shadow for depth
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px Arial';  // Increased from 14px
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const lines = text.split('\n');
    const lineHeight = 30;  // Increased from 18
    const totalHeight = lines.length * lineHeight;
    const startY = centerY - (totalHeight / 2) + (lineHeight / 2);
    
    lines.forEach((line, i) => {
        ctx.fillText(line, centerX, startY + (i * lineHeight));
    });
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
}

console.log('🎨 Generating Professional Sponsor Logos with Various Shapes...\n');
console.log(`📐 Canvas Size: ${CANVAS_SIZE}x${CANVAS_SIZE}px (Professional Quality)`);
console.log('✨ Features: Gradients, Shadows, White Borders, Multiple Shapes\n');

sponsors.forEach(sponsor => {
    const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    const ctx = canvas.getContext('2d');
    
    // Transparent background
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // Draw professional shape with gradient
    drawProfessionalShape(ctx, sponsor.shape, CENTER, CENTER, 85, sponsor.color1, sponsor.color2);
    
    // Add professional text
    addProfessionalText(ctx, sponsor.name, CENTER, CENTER);
    
    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(outputDir, sponsor.file);
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Created: ${sponsor.file.padEnd(25)} [${sponsor.shape}] - Professional Quality`);
});

console.log(`\n🎉 Generated ${sponsors.length} professional sponsor logos!`);
console.log(`📁 Location: ${outputDir}`);
console.log(`📏 Size: ${CANVAS_SIZE}x${CANVAS_SIZE}px per logo`);
console.log('\n📋 Shape Summary:');

const shapeCount = {};
sponsors.forEach(s => {
    shapeCount[s.shape] = (shapeCount[s.shape] || 0) + 1;
});

Object.entries(shapeCount).forEach(([shape, count]) => {
    console.log(`   ${shape}: ${count}`);
});
