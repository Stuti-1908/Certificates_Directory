const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// ============================================================================
// CONFIGURATION
// ============================================================================

// Default paths (relative to certificate-engine root)
const ENGINE_ROOT = path.resolve(__dirname, '..');
const DEFAULT_TEMPLATES_DIR = path.join(ENGINE_ROOT, 'assets', 'templates');
const DEFAULT_FONTS_DIR = path.join(ENGINE_ROOT, 'assets', 'fonts');
const DEFAULT_OUTPUT_DIR = path.join(ENGINE_ROOT, 'output');

// --- Template Configuration Per Rank ---
const TEMPLATE_CONFIG = {
    gold: {
        file: 'gold-certificate.jpeg',
        accentColor: '#C9A227',
        headerText: 'Merit',
        headerGradient: ['#997300', '#ffc000'],
        rankText: 'Gold',
        isWinner: true
    },
    silver: {
        file: 'silver-certificate.jpeg',
        accentColor: '#708090',
        headerText: 'Merit',
        headerGradient: ['#a8a8a8', '#e0e0e0'],
        rankText: 'Silver',
        isWinner: true
    },
    bronze: {
        file: 'bronze-certificate.jpeg',
        accentColor: '#CD7F32',
        headerText: 'Merit',
        headerGradient: ['#8b4513', '#cd853f'],
        rankText: 'Bronze',
        isWinner: true
    },
    participation: {
        file: 'participation-certificate.jpeg',
        accentColor: '#8B7355',
        headerText: 'Participation',
        headerGradient: ['#8e8372', '#efe5c5'],
        rankText: 'participating',
        isWinner: false
    }
};

// --- Layout Configuration ---
const LAYOUT = {
    textStartX: 57,
    headerTitleY: 550,
    certificateY: 618,
    certifyLabelY: 693,
    nameLineHeight: 33,
    firstNameY: 726,
    bodyStartGap: 8,
    bodyLineHeight: 27,
    certIdGap: 45,
    sponsorX: 45,
    sponsorY: 35
};

// --- Font Styles ---
const FONTS = {
    headerTitle: {
        font: 'italic 900 32px Shrikhand, Georgia, serif',
        gradientColors: ['#997300', '#ffc000'],
        gradientAngle: 180
    },
    certificate: {
        font: '400 65px "Bebas Neue", "Arial Narrow", Impact, sans-serif',
        color: '#000000',
        letterSpacing: 2
    },
    certifyLabel: {
        font: '400 19px Poppins, "Poppins Bold", Helvetica, Arial, sans-serif',
        color: '#555555'
    },
    name: {
        font: 'bold 19px "Poppins Bold", Poppins, Helvetica, Arial, sans-serif',
        color: '#000000'
    },
    bodyLabel: {
        font: '400 19px Poppins, Helvetica, Arial, sans-serif',
        color: '#555555'
    },
    bodyValue: {
        font: 'bold 19px "Poppins Bold", Poppins, Helvetica, Arial, sans-serif',
        color: '#000000'
    },
    accentValue: {
        font: 'bold 19px "Poppins Bold", Poppins, Helvetica, Arial, sans-serif',
    },
    certId: {
        font: '400 12px Arial',
        color: '#888888'
    },
    superscript: {
        font: '400 11px Arial',
        color: '#000000',
        raise: 5
    }
};

// ============================================================================
// FONT LOADING
// ============================================================================

let fontsLoaded = false;

function loadCustomFonts(fontsDir) {
    if (fontsLoaded) return;
    const dir = fontsDir || DEFAULT_FONTS_DIR;

    const fontMappings = [
        { file: 'Shrikhand-Regular.ttf', family: 'Shrikhand' },
        { file: 'BebasNeue-Regular.ttf', family: 'Bebas Neue' },
        { file: 'Poppins-Regular.ttf', family: 'Poppins' },
        { file: 'Poppins-Bold.ttf', family: 'Poppins Bold' },
    ];

    for (const font of fontMappings) {
        const fontPath = path.join(dir, font.file);
        if (fs.existsSync(fontPath)) {
            try {
                GlobalFonts.registerFromPath(fontPath, font.family);
            } catch (err) {
                console.warn(`Failed to load font ${font.file}: ${err.message}`);
            }
        }
    }

    fontsLoaded = true;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTemplateConfig(certificateType) {
    const key = certificateType.toLowerCase();
    return TEMPLATE_CONFIG[key] || TEMPLATE_CONFIG.participation;
}

function formatDateWithOrdinal(dateString) {
    if (!dateString) return null;

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-GB', { month: 'long' }).toLowerCase();
    const year = date.getFullYear();

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

function generateCertificateId(participant, index) {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    const nameCode = ((participant.firstName || 'X')[0] + (participant.lastName || 'X')[0]).toUpperCase();
    const typeCode = (participant.certificateType || 'P')[0].toUpperCase();
    return `CERT-${typeCode}${String(index + 1).padStart(4, '0')}-${nameCode}-${timestamp}`;
}

function drawTextWithSpacing(ctx, text, x, y, letterSpacing) {
    let currentX = x;
    for (const char of text) {
        ctx.fillText(char, currentX, y);
        currentX += ctx.measureText(char).width + letterSpacing;
    }
}

function drawGradientText(ctx, text, x, y, font, gradientColors, textHeight = 30) {
    ctx.font = font;
    const gradient = ctx.createLinearGradient(x, y - textHeight, x, y);
    gradient.addColorStop(0, gradientColors[0]);
    gradient.addColorStop(1, gradientColors[1]);
    ctx.fillStyle = gradient;
    ctx.fillText(text, x, y);
}

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

function drawDateWithSuperscript(ctx, x, y, dateInfo, boldFont, labelFont, superFont) {
    let currentX = x;
    ctx.font = boldFont;
    ctx.fillStyle = FONTS.bodyValue.color;
    ctx.fillText(dateInfo.day, currentX, y);
    currentX += ctx.measureText(dateInfo.day).width;

    ctx.font = superFont;
    ctx.fillStyle = FONTS.superscript.color;
    const raiseAmount = FONTS.superscript.raise || 5;
    ctx.fillText(dateInfo.suffix, currentX, y - raiseAmount);
    currentX += ctx.measureText(dateInfo.suffix).width;

    ctx.font = boldFont;
    ctx.fillStyle = FONTS.bodyValue.color;
    const monthYear = ` ${dateInfo.month}, ${dateInfo.year}`;
    ctx.fillText(monthYear, currentX, y);
    currentX += ctx.measureText(monthYear).width;

    return currentX;
}

function calculateLogoLayout(logos, maxWidth = 450, maxHeight = 180) {
    if (logos.length === 0) return [];

    const maxLogoHeight = 120;
    const smallThreshold = 80;
    const spacing = 20;

    const allSmall = logos.every(logo => logo.width <= smallThreshold);
    const layout = [];

    if (allSmall && logos.length <= 3) {
        let currentX = 0;
        logos.forEach((logo) => {
            const scale = Math.min(1, maxLogoHeight / logo.height);
            const w = logo.width * scale;
            const h = logo.height * scale;
            layout.push({ logo, x: currentX, y: 0, width: w, height: h });
            currentX += w + spacing;
        });
    } else {
        if (logos.length === 1) {
            const scale = Math.min(1, maxLogoHeight / logos[0].height, 140 / logos[0].width);
            layout.push({ logo: logos[0], x: 0, y: 0, width: logos[0].width * scale, height: logos[0].height * scale });
        } else if (logos.length === 2) {
            let currentX = 0;
            logos.forEach(logo => {
                const scale = Math.min(1, maxLogoHeight / logo.height);
                const w = logo.width * scale;
                const h = logo.height * scale;
                layout.push({ logo, x: currentX, y: 0, width: w, height: h });
                currentX += w + spacing;
            });
        } else {
            let currentX = 0;
            const logoHeight = 85;
            for (let i = 0; i < 2; i++) {
                const logo = logos[i];
                const scale = Math.min(1, logoHeight / logo.height);
                const w = logo.width * scale;
                const h = logo.height * scale;
                layout.push({ logo, x: currentX, y: 0, width: w, height: h });
                currentX += w + spacing;
            }
            if (logos[2]) {
                const logo = logos[2];
                const scale = Math.min(1, logoHeight / logo.height);
                const w = logo.width * scale;
                const h = logo.height * scale;
                layout.push({ logo, x: 0, y: logoHeight + 20, width: w, height: h });
            }
        }
    }

    return layout;
}

async function drawSponsorLogos(ctx, sponsors, startX = 30, startY = 30) {
    if (!sponsors || sponsors.length === 0) return;

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
            }
        } catch (err) {
            console.warn(`Failed to load logo ${sponsor.logoPath}: ${err.message}`);
        }
    }

    if (loadedLogos.length === 0) return;

    const layout = calculateLogoLayout(loadedLogos);
    layout.forEach(item => {
        ctx.drawImage(item.logo.image, startX + item.x, startY + item.y, item.width, item.height);
    });
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

/**
 * Generate a single certificate.
 * @param {Object} participant - Participant data object
 * @param {number} index - Index for certificate ID generation
 * @param {Object} sponsorsByEvent - Sponsors grouped by event name
 * @param {Object} options - Optional overrides
 * @param {string} options.outputDir - Override output directory
 * @param {string} options.templatesDir - Override templates directory
 * @param {string} options.fontsDir - Override fonts directory
 * @returns {Object|null} Result with filePath, certId, name, type, fileName
 */
async function generateCertificate(participant, index, sponsorsByEvent = {}, options = {}) {
    const outputDir = options.outputDir || DEFAULT_OUTPUT_DIR;
    const templatesDir = options.templatesDir || DEFAULT_TEMPLATES_DIR;
    const fontsDir = options.fontsDir || DEFAULT_FONTS_DIR;

    // Ensure fonts are loaded
    loadCustomFonts(fontsDir);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const fullName = `${participant.firstName} ${participant.middleName || ''} ${participant.lastName}`.replace(/\s+/g, ' ').trim();
    const config = getTemplateConfig(participant.certificateType);
    const templatePath = path.join(templatesDir, config.file);

    if (!fs.existsSync(templatePath)) {
        console.error(`Template not found: '${config.file}'`);
        return null;
    }

    // Load template image
    const template = await loadImage(templatePath);
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    // Draw template background
    ctx.drawImage(template, 0, 0);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    // Sponsor Logos
    const eventSponsors = sponsorsByEvent[participant.eventName] || [];
    if (eventSponsors.length > 0) {
        await drawSponsorLogos(ctx, eventSponsors, LAYOUT.sponsorX, LAYOUT.sponsorY);
    }

    const startX = LAYOUT.textStartX;
    let currentY;

    // Header: "Merit" or "Participation"
    drawGradientText(ctx, config.headerText, startX, LAYOUT.headerTitleY, FONTS.headerTitle.font, config.headerGradient, 32);

    // "CERTIFICATE"
    ctx.font = FONTS.certificate.font;
    ctx.fillStyle = FONTS.certificate.color;
    drawTextWithSpacing(ctx, 'CERTIFICATE', startX, LAYOUT.certificateY, FONTS.certificate.letterSpacing);

    // "This is to certify"
    currentY = LAYOUT.certifyLabelY;
    ctx.font = FONTS.certifyLabel.font;
    ctx.fillStyle = FONTS.certifyLabel.color;
    ctx.fillText('This is to certify', startX, currentY);

    // First Name
    currentY = LAYOUT.firstNameY;
    ctx.font = FONTS.name.font;
    ctx.fillStyle = FONTS.name.color;
    ctx.fillText(participant.firstName || '', startX, currentY);
    currentY += LAYOUT.nameLineHeight;

    // Middle Name (optional)
    const hasMiddleName = participant.middleName && participant.middleName.trim() !== '';
    if (hasMiddleName) {
        ctx.fillText(participant.middleName, startX, currentY);
        currentY += LAYOUT.nameLineHeight;
    }

    // Last Name
    ctx.fillText(participant.lastName || '', startX, currentY);
    currentY += LAYOUT.nameLineHeight + LAYOUT.bodyStartGap;

    // Body section
    if (config.isWinner) {
        drawMixedLine(ctx, startX, currentY, [
            { text: 'for winning ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: config.rankText, font: FONTS.accentValue.font, color: config.accentColor },
            { text: ' in  ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: participant.sport || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
        ]);
    } else {
        const parts = [
            { text: 'for ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: 'participating', font: FONTS.accentValue.font, color: config.accentColor },
            { text: ' in ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
            { text: participant.sport || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
        ];
        if (participant.role && participant.role.trim() !== '') {
            parts.push({ text: ' as ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color });
            parts.push({ text: participant.role, font: FONTS.bodyValue.font, color: FONTS.bodyValue.color });
        }
        drawMixedLine(ctx, startX, currentY, parts);
    }
    currentY += LAYOUT.bodyLineHeight;

    // "at the Event Name"
    drawMixedLine(ctx, startX, currentY, [
        { text: 'at the ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
        { text: participant.eventName || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
    ]);
    currentY += LAYOUT.bodyLineHeight;

    // "organised by Organization"
    drawMixedLine(ctx, startX, currentY, [
        { text: 'organised by ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
        { text: participant.organization || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
    ]);
    currentY += LAYOUT.bodyLineHeight;

    // "under the aegis of Association"
    drawMixedLine(ctx, startX, currentY, [
        { text: 'under the aegis of ', font: FONTS.bodyLabel.font, color: FONTS.bodyLabel.color },
        { text: participant.association || '', font: FONTS.bodyValue.font, color: FONTS.bodyValue.color }
    ]);
    currentY += LAYOUT.bodyLineHeight;

    // "from StartDate"
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

    // "to EndDate"
    const endDateInfo = formatDateWithOrdinal(participant.endDate);
    if (endDateInfo) {
        ctx.font = FONTS.bodyLabel.font;
        ctx.fillStyle = FONTS.bodyLabel.color;
        ctx.fillText('to ', startX, currentY);
        const afterTo = startX + ctx.measureText('to ').width;
        drawDateWithSuperscript(ctx, afterTo, currentY, endDateInfo,
            FONTS.bodyValue.font, FONTS.bodyLabel.font, FONTS.superscript.font);
    }
    currentY += LAYOUT.certIdGap;

    // Certificate ID
    const certId = generateCertificateId(participant, index);
    ctx.font = FONTS.certId.font;
    ctx.fillStyle = FONTS.certId.color;
    ctx.fillText(`Certificate ID: ${certId}`, startX, currentY);

    // Save output
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    const safeFirstName = (participant.firstName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');
    const safeLastName = (participant.lastName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${safeFirstName}_${safeLastName}_${participant.certificateType}.jpg`;
    const outputPath = path.join(outputDir, fileName);

    fs.writeFileSync(outputPath, buffer);

    return {
        filePath: outputPath,
        fileName,
        certId,
        name: fullName,
        type: participant.certificateType
    };
}

/**
 * Generate certificates for multiple participants.
 * @param {Array} participants - Array of participant data objects
 * @param {Object} sponsorsByEvent - Sponsors grouped by event name
 * @param {Object} options - Optional overrides (outputDir, templatesDir, fontsDir)
 * @returns {Object} { results: Array, successCount, failCount, byType }
 */
async function generateBatch(participants, sponsorsByEvent = {}, options = {}) {
    const results = [];
    const byType = { gold: [], silver: [], bronze: [], participation: [] };
    let successCount = 0;

    for (let i = 0; i < participants.length; i++) {
        try {
            const result = await generateCertificate(participants[i], i, sponsorsByEvent, options);
            if (result) {
                successCount++;
                results.push(result);
                const type = participants[i].certificateType.toLowerCase();
                if (byType[type]) {
                    byType[type].push(result);
                }
            }
        } catch (err) {
            console.error(`Failed to generate certificate for participant ${i + 1}: ${err.message}`);
            results.push({ error: err.message, index: i });
        }
    }

    return {
        results,
        successCount,
        failCount: participants.length - successCount,
        total: participants.length,
        byType
    };
}

module.exports = {
    generateCertificate,
    generateBatch,
    loadCustomFonts,
    TEMPLATE_CONFIG,
    LAYOUT,
    FONTS
};
