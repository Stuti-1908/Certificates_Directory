const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// ============================================================================
// 1. CONFIGURATION
// ============================================================================
const OUTPUT_DIR = './output';
const TEMPLATES_DIR = './assets/templates';
const FONTS_DIR = './assets/fonts';
const CSV_FILE = './data/participants.csv';
const SPONSORS_CSV_FILE = './data/sponsors.csv';
const CALIBRATION_FILE = './calibration-results.json';

// Create output folder if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// ============================================================================
// CUSTOM FONT LOADING
// ============================================================================
/**
 * Register custom fonts from the fonts folder
 * These fonts match Canva's design specifications
 */
function loadCustomFonts() {
    const fontMappings = [
        { file: 'Shrikhand-Regular.ttf', family: 'Shrikhand' },
        { file: 'BebasNeue-Regular.ttf', family: 'Bebas Neue' },
        { file: 'Poppins-Regular.ttf', family: 'Poppins' },
        { file: 'Poppins-Bold.ttf', family: 'Poppins Bold' },
        // Add more fonts as needed
    ];
    
    let loadedCount = 0;
    
    for (const font of fontMappings) {
        const fontPath = path.join(FONTS_DIR, font.file);
        if (fs.existsSync(fontPath)) {
            try {
                GlobalFonts.registerFromPath(fontPath, font.family);
                console.log(`   ✅ Loaded font: ${font.family}`);
                loadedCount++;
            } catch (err) {
                console.warn(`   ⚠️ Failed to load font ${font.file}: ${err.message}`);
            }
        }
    }
    
    if (loadedCount === 0) {
        console.log('   ℹ️ No custom fonts found. Using system fallback fonts.');
        console.log('   ℹ️ See assets/fonts/README.md for font installation instructions.');
    }
    
    return loadedCount;
}

// --- Template Configuration Per Rank ---
// Using actual template filenames from assets/templates folder
const TEMPLATE_CONFIG = {
    gold: {
        file: 'gold-certificate.jpeg',
        accentColor: '#C9A227',    // Rich golden color
        headerText: 'Merit',       // Header title (italic, colored)
        headerGradient: ['#997300', '#ffc000'],  // Gold gradient for "Merit" text
        rankText: 'Gold',
        isWinner: true
    },
    silver: {
        file: 'silver-certificate.jpeg',
        accentColor: '#708090',    // Silver/slate color
        headerText: 'Merit',
        headerGradient: ['#a8a8a8', '#e0e0e0'],  // Silver gradient for "Merit" text
        rankText: 'Silver',
        isWinner: true
    },
    bronze: {
        file: 'bronze-certificate.jpeg',
        accentColor: '#CD7F32',    // Bronze color
        headerText: 'Merit',
        headerGradient: ['#8b4513', '#cd853f'],  // Bronze gradient for "Merit" text
        rankText: 'Bronze',
        isWinner: true
    },
    participation: {
        file: 'participation-certificate.jpeg',
        accentColor: '#8B7355',    // Brownish/taupe color
        headerText: 'Participation',
        headerGradient: ['#8e8372', '#efe5c5'],  // Linear gradient 0 degree as specified
        rankText: 'participating',
        isWinner: false
    }
};

// --- Layout Configuration (based on precise pixel analysis of reference image) ---
// Canvas size: 1080x1920 (portrait orientation)
const LAYOUT = {
    // Starting X position for all text (left margin from edge)
    textStartX: 57,
    
    // ============ HEADER SECTION ============
    // "Merit" or "Participation" - bold italic header
    headerTitleY: 550,
    
    // "CERTIFICATE" - large bold text (reduced gap from Merit)
    certificateY: 618,
    
    // ============ NAME SECTION ============
    // Gap after CERTIFICATE before "This is to certify": ~75px
    certifyLabelY: 693,       // "This is to certify"
    
    // Names - each on separate line with consistent spacing
    nameLineHeight: 33,       // Vertical space between each name line
    firstNameY: 726,          // First name starts here
    
    // ============ BODY SECTION ============
    // Body text starts after last name with extra gap
    bodyStartGap: 8,          // Extra gap before body section starts
    bodyLineHeight: 27,       // Space between body text lines
    
    // ============ CERTIFICATE ID ============
    certIdGap: 45,            // Gap before certificate ID
    
    // ============ SPONSOR LOGOS ============
    sponsorX: 45,
    sponsorY: 35
};

// --- Font Styles (exact specifications from design) ---
const FONTS = {
    // "Merit" / "Participation" - Shrikhand font EXTRA BOLD + ITALIC (from Canva)
    // Size: 29.2px - increased weight for better visibility
    // Color: linear gradient 180 degree: #997300 to #ffc000
    headerTitle: {
        font: 'italic 900 32px Shrikhand, Georgia, serif',  // Increased to 900 weight and 32px
        gradientColors: ['#997300', '#ffc000'],  // Top to bottom gradient
        gradientAngle: 180  // degrees
    },
    
    // "CERTIFICATE" - Bebas Neue (condensed font, similar to Canva's condensed options)
    // Size: 65px, Bold, Pure Black
    certificate: {
        font: '400 65px "Bebas Neue", "Arial Narrow", Impact, sans-serif',
        color: '#000000',
        letterSpacing: 2
    },
    
    // "This is to certify" - Poppins (similar to Avenir in Canva)
    certifyLabel: {
        font: '400 19px Poppins, "Poppins Bold", Helvetica, Arial, sans-serif',
        color: '#555555'
    },
    
    // Names (First, Middle, Last) - Poppins bold
    name: {
        font: 'bold 19px "Poppins Bold", Poppins, Helvetica, Arial, sans-serif',
        color: '#000000'
    },
    
    // Body text labels - Poppins regular
    // "for winning", "in", "at the", "organised by", "under the aegis of", "from", "to"
    bodyLabel: {
        font: '400 19px Poppins, Helvetica, Arial, sans-serif',
        color: '#555555'
    },
    
    // Body text values - Poppins bold
    // Sport name, Event name, Organization, Association, Dates
    bodyValue: {
        font: 'bold 19px "Poppins Bold", Poppins, Helvetica, Arial, sans-serif',
        color: '#000000'
    },
    
    // Accent text (Gold/Silver/Bronze or "participating") - Poppins bold, colored
    accentValue: {
        font: 'bold 19px "Poppins Bold", Poppins, Helvetica, Arial, sans-serif',
        // color set dynamically from config.accentColor
    },
    
    // Certificate ID - small, grey
    certId: {
        font: '400 12px Arial',
        color: '#888888'
    },
    
    // Superscript for date ordinals (th, st, nd, rd)
    superscript: {
        font: '400 11px Arial',
        color: '#000000',
        raise: 5  // pixels to raise above baseline
    }
};

// ============================================================================
// 2. CSV PARSER
// ============================================================================

/**
 * Parse CSV file and return array of participant objects
 */
function parseCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ CSV file not found: ${filePath}`);
        return [];
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) {
        console.error('❌ CSV file is empty or has no data rows');
        return [];
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse data rows
    const participants = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const participant = {};
            headers.forEach((header, index) => {
                participant[header] = values[index].trim();
            });
            participant.rowNumber = i + 1; // For error reporting
            participants.push(participant);
        } else {
            console.warn(`⚠️ Skipping row ${i + 1}: column count mismatch`);
        }
    }

    return participants;
}

/**
 * Parse a single CSV line (handles quoted values)
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    
    return result;
}

/**
 * Parse sponsors CSV and group by event name
 */
function parseSponsorsCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`⚠️ Sponsors CSV not found: ${filePath}`);
        return {};
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    
    if (lines.length < 2) {
        console.warn('⚠️ Sponsors CSV is empty');
        return {};
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const sponsorsByEvent = {};
    
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const sponsor = {};
            headers.forEach((header, index) => {
                sponsor[header] = values[index].trim();
            });
            
            const eventName = sponsor.eventName;
            if (!sponsorsByEvent[eventName]) {
                sponsorsByEvent[eventName] = [];
            }
            sponsorsByEvent[eventName].push(sponsor);
        }
    }
    
    // Sort by priority and limit to max 3 sponsors per event
    Object.keys(sponsorsByEvent).forEach(eventName => {
        sponsorsByEvent[eventName].sort((a, b) => 
            parseInt(a.priority || 999) - parseInt(b.priority || 999)
        );
        sponsorsByEvent[eventName] = sponsorsByEvent[eventName].slice(0, 3);
    });
    
    return sponsorsByEvent;
}

// ============================================================================
// 3. HELPER FUNCTIONS
// ============================================================================

/**
 * Get template configuration based on certificate type
 */
function getTemplateConfig(certificateType) {
    const key = certificateType.toLowerCase();
    return TEMPLATE_CONFIG[key] || TEMPLATE_CONFIG.participation;
}

/**
 * Format date with ordinal suffix (e.g., "10th december, 2026")
 * Returns object with parts for superscript rendering
 * Month is lowercase as per reference image
 */
function formatDateWithOrdinal(dateString) {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const day = date.getDate();
    // Get month in lowercase as shown in reference image
    const month = date.toLocaleDateString('en-GB', { month: 'long' }).toLowerCase();
    const year = date.getFullYear();
    
    // Get ordinal suffix
    let suffix = 'th';
    if (day === 1 || day === 21 || day === 31) suffix = 'st';
    else if (day === 2 || day === 22) suffix = 'nd';
    else if (day === 3 || day === 23) suffix = 'rd';
    
    return {
        day: String(day),
        suffix: suffix,
        month: month,
        year: String(year),
        full: `${day}${suffix} ${month}, ${year}`
    };
}

/**
 * Format date simple (e.g., "15 March 2026")
 */
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Generate unique certificate ID
 */
function generateCertificateId(participant, index) {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    const nameCode = ((participant.firstName || 'X')[0] + (participant.lastName || 'X')[0]).toUpperCase();
    const typeCode = (participant.certificateType || 'P')[0].toUpperCase();
    return `CERT-${typeCode}${String(index + 1).padStart(4, '0')}-${nameCode}-${timestamp}`;
}

/**
 * Draw text with letter spacing (for "CERTIFICATE" text)
 */
function drawTextWithSpacing(ctx, text, x, y, letterSpacing) {
    let currentX = x;
    for (const char of text) {
        ctx.fillText(char, currentX, y);
        currentX += ctx.measureText(char).width + letterSpacing;
    }
}

/**
 * Draw text with a vertical gradient fill (180 degrees = top to bottom)
 * Used for "Merit" / "Participation" header
 */
function drawGradientText(ctx, text, x, y, font, gradientColors, textHeight = 30) {
    ctx.font = font;
    
    // Create vertical gradient (top to bottom)
    const gradient = ctx.createLinearGradient(x, y - textHeight, x, y);
    gradient.addColorStop(0, gradientColors[0]);  // Top color
    gradient.addColorStop(1, gradientColors[1]);  // Bottom color
    
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, y);
}

/**
 * Draw a line with mixed styles (label + value on same line)
 * Returns the x position after the last text
 */
function drawMixedLine(ctx, x, y, parts) {
    let currentX = x;
    for (const part of parts) {
        if (part.font) ctx.font = part.font;
        if (part.color) ctx.fillStyle = part.color;
        ctx.fillText(part.text, currentX, y);
        currentX += ctx.measureText(part.text).width;
    }
    return currentX;
}

/**
 * Draw date with superscript ordinal (e.g., 10th december, 2026)
 * Superscript is raised above baseline
 */
function drawDateWithSuperscript(ctx, x, y, dateInfo, boldFont, labelFont, superFont) {
    let currentX = x;
    
    // Draw day number in bold
    ctx.font = boldFont;
    ctx.fillStyle = FONTS.bodyValue.color;
    ctx.fillText(dateInfo.day, currentX, y);
    currentX += ctx.measureText(dateInfo.day).width;
    
    // Draw ordinal suffix as superscript (smaller, raised)
    ctx.font = superFont;
    ctx.fillStyle = FONTS.superscript.color;
    const raiseAmount = FONTS.superscript.raise || 5;
    ctx.fillText(dateInfo.suffix, currentX, y - raiseAmount);
    currentX += ctx.measureText(dateInfo.suffix).width;
    
    // Draw space + month + comma + space + year in bold
    ctx.font = boldFont;
    ctx.fillStyle = FONTS.bodyValue.color;
    const monthYear = ` ${dateInfo.month}, ${dateInfo.year}`;
    ctx.fillText(monthYear, currentX, y);
    currentX += ctx.measureText(monthYear).width;
    
    return currentX;
}

/**
 * Calculate smart logo layout based on dimensions
 * Max 3 logos: small logos in one row, large logos in 2+1 layout
 */
function calculateLogoLayout(logos, maxWidth = 450, maxHeight = 180) {
    if (logos.length === 0) return [];
    
    const maxLogoHeight = 120;  // Max height for any single logo (increased from 80)
    const smallThreshold = 80;  // If all logos < this width, put in one row (increased from 60)
    const spacing = 20;         // Space between logos (increased from 15)
    
    // Check if all logos are "small"
    const allSmall = logos.every(logo => logo.width <= smallThreshold);
    
    const layout = [];
    
    if (allSmall && logos.length <= 3) {
        // Layout: All in one horizontal row
        let currentX = 0;
        logos.forEach((logo, i) => {
            const scale = Math.min(1, maxLogoHeight / logo.height);
            const w = logo.width * scale;
            const h = logo.height * scale;
            layout.push({
                logo,
                x: currentX,
                y: 0,
                width: w,
                height: h
            });
            currentX += w + spacing;
        });
    } else {
        // Layout: Smart 2+1 or 1+2 based on sizes
        // Sort by width descending to identify "large" logos
        const sortedLogos = [...logos].map((logo, originalIndex) => ({
            ...logo,
            originalIndex
        })).sort((a, b) => b.width - a.width);
        
        if (logos.length === 1) {
            // Single logo: center it
            const scale = Math.min(1, maxLogoHeight / logos[0].height, 140 / logos[0].width);  // Increased from 100
            layout.push({
                logo: logos[0],
                x: 0,
                y: 0,
                width: logos[0].width * scale,
                height: logos[0].height * scale
            });
        } else if (logos.length === 2) {
            // Two logos: side by side
            let currentX = 0;
            logos.forEach(logo => {
                const scale = Math.min(1, maxLogoHeight / logo.height);
                const w = logo.width * scale;
                const h = logo.height * scale;
                layout.push({
                    logo,
                    x: currentX,
                    y: 0,
                    width: w,
                    height: h
                });
                currentX += w + spacing;
            });
        } else {
            // Three logos: Balanced layout - all same size
            let currentX = 0;
            const logoHeight = 85;  // Same height for all logos for balanced look
            
            // First row: two logos
            for (let i = 0; i < 2; i++) {
                const logo = logos[i];
                const scale = Math.min(1, logoHeight / logo.height);
                const w = logo.width * scale;
                const h = logo.height * scale;
                layout.push({
                    logo,
                    x: currentX,
                    y: 0,
                    width: w,
                    height: h
                });
                currentX += w + spacing;
            }
            
            // Second row: one logo (same size as others)
            if (logos[2]) {
                const logo = logos[2];
                const scale = Math.min(1, logoHeight / logo.height);  // Same size as top row
                const w = logo.width * scale;
                const h = logo.height * scale;
                layout.push({
                    logo,
                    x: 0,
                    y: logoHeight + 20,  // Below first row with spacing
                    width: w,
                    height: h
                });
            }
        }
    }
    
    return layout;
}

/**
 * Load and draw sponsor logos at top-left corner
 */
async function drawSponsorLogos(ctx, sponsors, startX = 30, startY = 30) {
    if (!sponsors || sponsors.length === 0) return;
    
    // Load all logo images
    const loadedLogos = [];
    for (const sponsor of sponsors) {
        try {
            if (fs.existsSync(sponsor.logoPath)) {
                const img = await loadImage(sponsor.logoPath);
                loadedLogos.push({
                    name: sponsor.sponsorName,
                    image: img,
                    width: img.width,
                    height: img.height
                });
            } else {
                console.warn(`   ⚠️ Sponsor logo not found: ${sponsor.logoPath}`);
            }
        } catch (err) {
            console.warn(`   ⚠️ Failed to load logo ${sponsor.logoPath}: ${err.message}`);
        }
    }
    
    if (loadedLogos.length === 0) return;
    
    // Calculate layout
    const layout = calculateLogoLayout(loadedLogos);
    
    // Draw each logo
    layout.forEach(item => {
        ctx.drawImage(
            item.logo.image,
            startX + item.x,
            startY + item.y,
            item.width,
            item.height
        );
    });
}

/**
 * PLACEHOLDER POSITIONS - Where placeholder text appears in pre-printed templates
 * Template structure (from OCR analysis):
 *   Merit / This is to certify / First Name / Middle Name / Last Name
 *   for winning Gold in SPORT / at the EVENT NAME / organised by ORGANISATION
 *   under the aegis of ASSOCIATION / from DATE / to DATE
 * 
 * We need to COVER the placeholder text and draw replacement values
 */
// Utility: safe JSON reader
function tryReadJSON(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, 'utf-8');
            return JSON.parse(raw);
        }
    } catch (_) {}
    return null;
}

// ============================================================================
// 4. CERTIFICATE GENERATOR ENGINE - PRECISE LAYOUT
// ============================================================================

/**
 * Draw all certificate text dynamically onto the template
 * Precise pixel-perfect layout based on reference image analysis
 */
async function generateCertificate(participant, index, sponsorsByEvent) {
    const fullName = `${participant.firstName} ${participant.middleName || ''} ${participant.lastName}`.replace(/\s+/g, ' ').trim();
    console.log(`📝 Processing [${index + 1}]: ${fullName} (${participant.certificateType})...`);

    const config = getTemplateConfig(participant.certificateType);
    const templatePath = path.join(TEMPLATES_DIR, config.file);
    
    // Safety Check: Does the template file exist?
    if (!fs.existsSync(templatePath)) {
        console.error(`   ❌ Template not found: '${config.file}'`);
        return null;
    }

    // Load template image (base background with medal graphics)
    const template = await loadImage(templatePath);
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    // Draw template background
    ctx.drawImage(template, 0, 0);
    
    // Set text alignment defaults
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // ==================== SPONSOR LOGOS (Top Left) ====================
    const eventSponsors = sponsorsByEvent[participant.eventName] || [];
    if (eventSponsors.length > 0) {
        await drawSponsorLogos(ctx, eventSponsors, LAYOUT.sponsorX, LAYOUT.sponsorY);
    }

    const startX = LAYOUT.textStartX;
    let currentY;

    // ==================== HEADER SECTION ====================
    
    // 1. Draw "Merit" or "Participation" with dynamic gradient based on certificate type
    // Gold: #997300 to #ffc000, Silver: silver gradient, Bronze: bronze gradient
    // Participation: #8e8372 to #efe5c5 (0 degree - horizontal)
    drawGradientText(
        ctx, 
        config.headerText, 
        startX, 
        LAYOUT.headerTitleY, 
        FONTS.headerTitle.font, 
        config.headerGradient,  // Use gradient from config (varies by type)
        32  // text height for gradient calculation (updated to match font size)
    );
    
    // 2. Draw "CERTIFICATE" (Tw Cen MT Condensed / Arial Narrow, bold, black)
    ctx.font = FONTS.certificate.font;
    ctx.fillStyle = FONTS.certificate.color;
    drawTextWithSpacing(ctx, 'CERTIFICATE', startX, LAYOUT.certificateY, FONTS.certificate.letterSpacing);

    // ==================== NAME SECTION ====================
    
    // 3. Draw "This is to certify" (regular, grey)
    currentY = LAYOUT.certifyLabelY;
    ctx.font = FONTS.certifyLabel.font;
    ctx.fillStyle = FONTS.certifyLabel.color;
    ctx.fillText('This is to certify', startX, currentY);
    
    // 4. Draw First Name (bold, black)
    currentY = LAYOUT.firstNameY;
    ctx.font = FONTS.name.font;
    ctx.fillStyle = FONTS.name.color;
    ctx.fillText(participant.firstName || '', startX, currentY);
    currentY += LAYOUT.nameLineHeight;
    
    // 5. Draw Middle Name (bold, black) - only if exists
    const hasMiddleName = participant.middleName && participant.middleName.trim() !== '';
    if (hasMiddleName) {
        ctx.fillText(participant.middleName, startX, currentY);
        currentY += LAYOUT.nameLineHeight;
    }
    
    // 6. Draw Last Name (bold, black)
    ctx.fillText(participant.lastName || '', startX, currentY);
    
    // Add gap before body section
    currentY += LAYOUT.nameLineHeight + LAYOUT.bodyStartGap;

    // ==================== BODY SECTION ====================
    
    // 7. Draw "for winning Gold in Sport" OR "for participating in Sport as Role"
    if (config.isWinner) {
        // Merit certificates: "for winning Gold in Tennis"
        drawMixedLine(ctx, startX, currentY, [
            { text: 'for winning ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: config.rankText, font: FONTS.accentValue.font, color: config.accentColor },
            { text: ' in  ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: participant.sport || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
        ]);
    } else {
        // Participation certificates: "for participating in 100m Sprint as Athlete"
        const parts = [
            { text: 'for ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: 'participating', font: FONTS.accentValue.font, color: config.accentColor },
            { text: ' in ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: participant.sport || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
        ];
        
        // Add role if exists
        if (participant.role && participant.role.trim() !== '') {
            parts.push({ text: ' as ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color });
            parts.push({ text: participant.role, font: FONTS.bodyValue.font, color: FONTS.bodyValue.color });
        }
        
        drawMixedLine(ctx, startX, currentY, parts);
    }
    currentY += LAYOUT.bodyLineHeight;
    
    // 8. Draw "at the Event Name" (event name in bold)
    drawMixedLine(ctx, startX, currentY, [
        { text: 'at the ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
        { text: participant.eventName || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
    ]);
    currentY += LAYOUT.bodyLineHeight;
    
    // 9. Draw "organised by Organization"
    drawMixedLine(ctx, startX, currentY, [
        { text: 'organised by ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
        { text: participant.organization || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
    ]);
    currentY += LAYOUT.bodyLineHeight;
    
    // 10. Draw "under the aegis of Association"
    drawMixedLine(ctx, startX, currentY, [
        { text: 'under the aegis of ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
        { text: participant.association || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
    ]);
    currentY += LAYOUT.bodyLineHeight;
    
    // 11. Draw "from StartDate" with superscript ordinal
    const startDateInfo = formatDateWithOrdinal(participant.startDate);
    if (startDateInfo) {
        ctx.font = FONTS.bodyLabel.font;
        ctx.fillStyle = FONTS.bodyLabel.color;
        ctx.fillText('from ', startX, currentY);
        const afterFrom = startX + ctx.measureText('from ').width;
        drawDateWithSuperscript(ctx, afterFrom, currentY, startDateInfo, 
            FONTS.bodyValue.font, FONTS.bodyLabel.font, FONTS.superscript.font);
    }
    currentY += LAYOUT.bodyLineHeight;
    
    // 12. Draw "to EndDate" with superscript ordinal
    const endDateInfo = formatDateWithOrdinal(participant.endDate);
    if (endDateInfo) {
        ctx.font = FONTS.bodyLabel.font;
        ctx.fillStyle = FONTS.bodyLabel.color;
        ctx.fillText('to ', startX, currentY);
        const afterTo = startX + ctx.measureText('to ').width;
        drawDateWithSuperscript(ctx, afterTo, currentY, endDateInfo, 
            FONTS.bodyValue.font, FONTS.bodyLabel.font, FONTS.superscript.font);
    }
    
    // Add gap before certificate ID
    currentY += LAYOUT.certIdGap;

    // ==================== CERTIFICATE ID ====================
    const certId = generateCertificateId(participant, index);
    ctx.font = FONTS.certId.font;
    ctx.fillStyle = FONTS.certId.color;
    ctx.fillText(`Certificate ID: ${certId}`, startX, currentY);

    // ==================== SAVE OUTPUT ====================
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    const safeFirstName = (participant.firstName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');
    const safeLastName = (participant.lastName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${safeFirstName}_${safeLastName}_${participant.certificateType}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, fileName);
    
    fs.writeFileSync(outputPath, buffer);
    console.log(`   ✅ Saved: ${fileName}`);
    
    return { filePath: outputPath, certId, name: fullName, type: participant.certificateType };
}

// ============================================================================
// 5. MAIN EXECUTION
// ============================================================================

(async function main() {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║           🎓 CERTIFICATE GENERATION ENGINE                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');

    // Load custom fonts
    console.log('🔤 Loading custom fonts...');
    loadCustomFonts();
    console.log('');

    // Parse CSV files
    console.log(`📂 Reading CSV: ${CSV_FILE}`);
    const participants = parseCSV(CSV_FILE);
    
    if (participants.length === 0) {
        console.error('❌ No participants found in CSV. Exiting.');
        return;
    }
    
    console.log(`📊 Found ${participants.length} participant(s)`);
    
    // Parse sponsors CSV
    console.log(`📂 Reading Sponsors: ${SPONSORS_CSV_FILE}`);
    const sponsorsByEvent = parseSponsorsCSV(SPONSORS_CSV_FILE);
    const totalSponsors = Object.values(sponsorsByEvent).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`🏢 Found ${totalSponsors} sponsor(s) across ${Object.keys(sponsorsByEvent).length} event(s)\n`);
    console.log('─'.repeat(65));
    
    const results = {
        gold: [],
        silver: [],
        bronze: [],
        participation: []
    };
    
    let successCount = 0;
    
    for (let i = 0; i < participants.length; i++) {
        const result = await generateCertificate(participants[i], i, sponsorsByEvent);
        if (result) {
            successCount++;
            const type = participants[i].certificateType.toLowerCase();
            if (results[type]) {
                results[type].push(result);
            }
        }
    }
    
    console.log('');
    console.log('═'.repeat(65));
    console.log(`✨ Generated ${successCount}/${participants.length} certificates successfully!`);
    console.log(`📁 Output folder: ${path.resolve(OUTPUT_DIR)}`);
    console.log('═'.repeat(65));
    
    // Print summary by category
    console.log('\n📋 SUMMARY BY CATEGORY:\n');
    
    if (results.gold.length > 0) {
        console.log(`🥇 GOLD (${results.gold.length}):`);
        results.gold.forEach(r => console.log(`   • ${r.name}`));
    }
    
    if (results.silver.length > 0) {
        console.log(`🥈 SILVER (${results.silver.length}):`);
        results.silver.forEach(r => console.log(`   • ${r.name}`));
    }
    
    if (results.bronze.length > 0) {
        console.log(`🥉 BRONZE (${results.bronze.length}):`);
        results.bronze.forEach(r => console.log(`   • ${r.name}`));
    }
    
    if (results.participation.length > 0) {
        console.log(`🏅 PARTICIPATION (${results.participation.length}):`);
        results.participation.forEach(r => console.log(`   • ${r.name}`));
    }
    
    console.log('');
})();