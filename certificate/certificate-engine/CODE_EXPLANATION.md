# Certificate Generator - Complete Code Explanation

## 📚 Simple Line-by-Line Explanation

---

## **PART 1: IMPORTS & SETUP (Lines 1-14)**

```javascript
const { createCanvas, loadImage } = require('@napi-rs/canvas');
```
**What it does:** Import special tools to create images and draw on them
- `createCanvas` = Makes a blank canvas (like a blank paper)
- `loadImage` = Loads existing images (like your certificate templates)

```javascript
const fs = require('fs');
const path = require('path');
```
**What it does:** Import tools to work with files
- `fs` = File System (read/write files)
- `path` = Handle file paths correctly

```javascript
const OUTPUT_DIR = './output';
const TEMPLATES_DIR = './assets/templates';
const CSV_FILE = './data/participants.csv';
const SPONSORS_CSV_FILE = './data/sponsors.csv';
```
**What it does:** Define folder locations
- Where to save certificates
- Where templates are stored
- Where participant data is
- Where sponsor data is

```javascript
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
```
**What it does:** Create output folder if it doesn't exist
- Check: Does "output" folder exist?
- If NO → Create it
- If YES → Do nothing

---

## **PART 2: CONFIGURATION (Lines 16-58)**

### Template Configuration Object

```javascript
const TEMPLATE_CONFIG = {
    gold: {
        file: 'gold.jpg',
        accentColor: '#DAA520',
        headerText: 'Merit',
        rankText: 'Gold',
        isWinner: true
    },
    // ... silver, bronze, participation
};
```

**What it does:** Store settings for each certificate type

For GOLD certificate:
- `file`: Use "gold.jpg" template
- `accentColor`: Use golden color (#DAA520) for "Gold" text
- `headerText`: Show "Merit" at top
- `rankText`: Write "Gold" in the certificate
- `isWinner`: True (they won something, not just participated)

Same structure for Silver, Bronze, and Participation.

### Font Styles Object

```javascript
const FONTS = {
    headerTitle: { font: 'italic 32px Georgia', color: '#DAA520' },
    headerCertificate: { font: '400 52px "Arial Black"', color: '#1a1a1a' },
    label: { font: '18px Arial', color: '#333333' },
    name: { font: 'bold 24px Arial', color: '#000000' },
    // ... more fonts
};
```

**What it does:** Define how each text type should look

- `headerTitle`: Merit/Participation text (italic, 32px)
- `headerCertificate`: "CERTIFICATE" word (large, 52px)
- `label`: Small regular text like "This is to certify"
- `name`: Bold text for participant names (24px)
- `body`: Regular body text (18px)
- `bold`: Bold highlights in body text
- `certId`: Tiny text for certificate ID (11px)

---

## **PART 3: CSV PARSER (Lines 60-180)**

### Function: parseCSV()

```javascript
function parseCSV(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ CSV file not found: ${filePath}`);
        return [];
    }
```
**What it does:** Check if CSV file exists
- If NO → Show error, return empty array
- If YES → Continue

```javascript
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
```
**What it does:** Read the entire file and split into lines
- `readFileSync`: Read file content as text
- `trim()`: Remove extra spaces
- `split('\n')`: Split by line breaks → array of lines

```javascript
    const headers = lines[0].split(',').map(h => h.trim());
```
**What it does:** Get column names from first row
- Take first line (line 0)
- Split by commas
- Remove spaces from each header

Example: "firstName,middleName,lastName" → ["firstName", "middleName", "lastName"]

```javascript
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const participant = {};
            headers.forEach((header, index) => {
                participant[header] = values[index].trim();
            });
            participants.push(participant);
        }
    }
```
**What it does:** Convert each data row into an object
- Loop through lines (starting from line 1, skipping header)
- Parse each line into values array
- Create object matching headers to values
- Add to participants array

Example:
```
Headers: ["firstName", "lastName", "rank"]
Values:  ["Stuti", "Patel", "Gold"]
Result:  { firstName: "Stuti", lastName: "Patel", rank: "Gold" }
```

### Function: parseCSVLine()

```javascript
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
```

**What it does:** Split CSV line correctly (handles commas inside quotes)

Why needed? Because CSV can have this:
```
"John, Jr.",Doe,Gold  ← Comma inside name!
```

Logic:
1. Go through each character
2. If `"` → toggle quote mode
3. If `,` AND not in quotes → end current value, start new one
4. Otherwise → add character to current value

Result: ["John, Jr.", "Doe", "Gold"] ✅

### Function: parseSponsorsCSV()

```javascript
function parseSponsorsCSV(filePath) {
    // Same as parseCSV but groups by event name
    
    const sponsorsByEvent = {};
    
    for (let i = 1; i < lines.length; i++) {
        // Parse sponsor
        const eventName = sponsor.eventName;
        if (!sponsorsByEvent[eventName]) {
            sponsorsByEvent[eventName] = [];
        }
        sponsorsByEvent[eventName].push(sponsor);
    }
```

**What it does:** Group sponsors by event name

Input:
```csv
eventName,sponsorName,logoPath,priority
Tech Summit 2026,TechCorp,./logo1.png,1
Tech Summit 2026,InnoLabs,./logo2.png,2
Mind Games 2026,BrainPower,./logo3.png,1
```

Output:
```javascript
{
    "Tech Summit 2026": [
        { sponsorName: "TechCorp", ... },
        { sponsorName: "InnoLabs", ... }
    ],
    "Mind Games 2026": [
        { sponsorName: "BrainPower", ... }
    ]
}
```

```javascript
    Object.keys(sponsorsByEvent).forEach(eventName => {
        sponsorsByEvent[eventName].sort((a, b) => 
            parseInt(a.priority || 999) - parseInt(b.priority || 999)
        );
        sponsorsByEvent[eventName] = sponsorsByEvent[eventName].slice(0, 3);
    });
```

**What it does:** Sort by priority and limit to 3 sponsors per event
- Sort: Priority 1, 2, 3... (lower number = higher priority)
- Slice: Keep only first 3

---

## **PART 4: HELPER FUNCTIONS (Lines 182-230)**

### Function: getTemplateConfig()

```javascript
function getTemplateConfig(certificateType) {
    const key = certificateType.toLowerCase();
    return TEMPLATE_CONFIG[key] || TEMPLATE_CONFIG.participation;
}
```

**What it does:** Get settings for a certificate type
- Convert to lowercase ("GOLD" → "gold")
- Look up in TEMPLATE_CONFIG
- If not found → use participation as default

### Function: formatDate()

```javascript
function formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
```

**What it does:** Convert date to readable format

Input: "2026-01-10"
Output: "10 January 2026"

- `'en-GB'`: British format (day before month)
- `day: 'numeric'`: Show day as number (10)
- `month: 'long'`: Full month name (January)
- `year: 'numeric'`: 4-digit year (2026)

### Function: generateCertificateId()

```javascript
function generateCertificateId(participant, index) {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-4);
    const nameCode = ((participant.firstName || 'X')[0] + (participant.lastName || 'X')[0]).toUpperCase();
    const typeCode = (participant.certificateType || 'P')[0].toUpperCase();
    return `CERT-${typeCode}${String(index + 1).padStart(4, '0')}-${nameCode}-${timestamp}`;
}
```

**What it does:** Create unique ID for each certificate

Example for Stuti Patel, Gold, 1st certificate:
- `timestamp`: Current time in base-36 (e.g., "ABC1")
- `nameCode`: First letters of name → "SP" (Stuti + Patel)
- `typeCode`: First letter of type → "G" (Gold)
- `index + 1`: Certificate number → "0001"

Result: `CERT-G0001-SP-ABC1`

### Function: drawMixedLine()

```javascript
function drawMixedLine(ctx, x, y, parts) {
    let currentX = x;
    for (const part of parts) {
        ctx.font = part.font;
        ctx.fillStyle = part.color;
        ctx.fillText(part.text, currentX, y);
        currentX += ctx.measureText(part.text).width;
    }
}
```

**What it does:** Draw text with different styles on same line

Example: "for winning **Gold** in **Badminton**"
- "for winning " → regular, black
- "Gold" → bold, golden color
- " in " → regular, black
- "Badminton" → bold, black

How it works:
1. Start at position x
2. For each text part:
   - Set its font & color
   - Draw it
   - Measure its width
   - Move x position right by that width
3. Next part starts where previous ended

### Function: drawText()

```javascript
function drawText(ctx, text, x, y, font, color) {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}
```

**What it does:** Simple text drawing
- Set font style
- Set color
- Draw text at (x, y) position

---

## **PART 5: LOGO LAYOUT LOGIC (Lines 232-340)**

### Function: calculateLogoLayout()

**Purpose:** Arrange 1-3 sponsor logos smartly

```javascript
function calculateLogoLayout(logos, maxWidth = 450, maxHeight = 180) {
    if (logos.length === 0) return [];
    
    const maxLogoHeight = 120;
    const smallThreshold = 80;
    const spacing = 20;
```

**Settings:**
- `maxLogoHeight`: No logo can be taller than 120px
- `smallThreshold`: Logos under 80px width = "small"
- `spacing`: 20px gap between logos

```javascript
    const allSmall = logos.every(logo => logo.width <= smallThreshold);
```

**What it does:** Check if ALL logos are small
- If yes → Put them all in one row
- If no → Use 2+1 layout (2 on top, 1 below)

#### Layout Option 1: All Small Logos

```javascript
    if (allSmall && logos.length <= 3) {
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
    }
```

**What it does:** Put all logos in one horizontal row

Example: [Logo1] [Logo2] [Logo3]

- Calculate scale to fit within maxLogoHeight
- Place at increasing x positions
- All at y=0 (same row)

#### Layout Option 2: Single Logo

```javascript
    if (logos.length === 1) {
        const scale = Math.min(1, maxLogoHeight / logos[0].height, 140 / logos[0].width);
        layout.push({
            logo: logos[0],
            x: 0,
            y: 0,
            width: logos[0].width * scale,
            height: logos[0].height * scale
        });
    }
```

**What it does:** Show single logo, scaled to fit
- Max height: 120px
- Max width: 140px

#### Layout Option 3: Two Logos

```javascript
    else if (logos.length === 2) {
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
    }
```

**What it does:** Place 2 logos side by side

Example: [Logo1] [Logo2]

#### Layout Option 4: Three Logos (Balanced)

```javascript
    else {
        let currentX = 0;
        const logoHeight = 85;  // ALL same size
        
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
        
        // Second row: one logo
        if (logos[2]) {
            const logo = logos[2];
            const scale = Math.min(1, logoHeight / logo.height);
            const w = logo.width * scale;
            const h = logo.height * scale;
            layout.push({
                logo,
                x: 0,
                y: logoHeight + 20,
                width: w,
                height: h
            });
        }
    }
```

**What it does:** Balanced 2+1 layout, ALL same height (85px)

```
[Logo1] [Logo2]
[Logo3]
```

All logos are same size for professional look!

---

## **PART 6: DRAW SPONSOR LOGOS (Lines 342-380)**

### Function: drawSponsorLogos()

```javascript
async function drawSponsorLogos(ctx, sponsors, startX = 30, startY = 30) {
    if (!sponsors || sponsors.length === 0) return;
```

**What it does:** Draw sponsor logos at top-left corner
- Default position: x=30, y=30 (top-left with small margin)
- If no sponsors → do nothing

```javascript
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
                console.warn(`⚠️ Sponsor logo not found: ${sponsor.logoPath}`);
            }
        } catch (err) {
            console.warn(`⚠️ Failed to load logo: ${err.message}`);
        }
    }
```

**What it does:** Load each logo image file
- Check if file exists
- Load image using `loadImage()`
- Store image + dimensions
- If error → show warning, continue (don't crash)

```javascript
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
```

**What it does:** Draw logos on canvas
1. Calculate smart positions (using calculateLogoLayout)
2. For each logo:
   - Draw at calculated position
   - With calculated size

---

## **PART 7: TEXT POSITIONS (Lines 382-410)**

### Function: getTextPositions()

```javascript
function getTextPositions(templateWidth, templateHeight) {
    const leftMargin = 68;
    const startY = 640;
    const lineHeight = 26;
    
    return {
        headerTitle: { x: leftMargin, y: 490 },
        headerCertificate: { x: leftMargin, y: 560 },
        thisIsToCertify: { x: leftMargin, y: startY },
        firstName: { x: leftMargin, y: startY + lineHeight },
        middleName: { x: leftMargin, y: startY + lineHeight * 2 },
        lastName: { x: leftMargin, y: startY + lineHeight * 3 },
        rankAndSport: { x: leftMargin, y: startY + lineHeight * 4 + 5 },
        eventName: { x: leftMargin, y: startY + lineHeight * 5 + 5 },
        organisation: { x: leftMargin, y: startY + lineHeight * 6 + 5 },
        association: { x: leftMargin, y: startY + lineHeight * 7 + 5 },
        dateFrom: { x: leftMargin, y: startY + lineHeight * 8 + 5 },
        dateTo: { x: leftMargin, y: startY + lineHeight * 9 + 5 },
        certificateId: { x: leftMargin, y: startY + lineHeight * 11 }
    };
}
```

**What it does:** Define where each text element goes

Layout calculation:
- All text starts at x=68 (left aligned)
- Header "Merit": y=490
- "CERTIFICATE": y=560
- Body starts at y=640
- Each line is 26px apart (lineHeight)
- Some lines have +5 extra spacing

Visual:
```
y=490  → Merit
y=560  → CERTIFICATE
y=640  → This is to certify
y=666  → First Name
y=692  → Middle Name
y=718  → Last Name
y=749  → for winning Gold in...
y=775  → at the Event Name...
(etc.)
```

---

## **PART 8: MAIN CERTIFICATE GENERATOR (Lines 412-560)**

### Function: generateCertificate()

```javascript
async function generateCertificate(participant, index, sponsorsByEvent) {
    const fullName = `${participant.firstName} ${participant.middleName || ''} ${participant.lastName}`.replace(/\s+/g, ' ').trim();
    console.log(`📝 Processing [${index + 1}]: ${fullName} (${participant.certificateType})...`);
```

**What it does:** Create full name & show progress
- Combine first + middle + last name
- `.replace(/\s+/g, ' ')`: Replace multiple spaces with single space
- `.trim()`: Remove spaces at start/end
- Log: "Processing [1]: Stuti Rajesh Patel (gold)..."

```javascript
    const config = getTemplateConfig(participant.certificateType);
    const templatePath = path.join(TEMPLATES_DIR, config.file);
    
    if (!fs.existsSync(templatePath)) {
        console.error(`❌ Template not found: '${config.file}'`);
        return null;
    }
```

**What it does:** Get template settings & check file exists
- Get config for certificate type (gold/silver/etc.)
- Build path to template file
- If file doesn't exist → show error, exit

```javascript
    // Load template image
    const template = await loadImage(templatePath);
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');
    
    // Draw template background
    ctx.drawImage(template, 0, 0);
```

**What it does:** Create canvas with template background
1. Load template image (gold.jpg, silver.jpg, etc.)
2. Create blank canvas (same size as template)
3. Get drawing context (ctx = paintbrush)
4. Draw template as background layer

```javascript
    // Draw sponsor logos at top-left
    const eventSponsors = sponsorsByEvent[participant.eventName] || [];
    if (eventSponsors.length > 0) {
        await drawSponsorLogos(ctx, eventSponsors, 30, 30);
    }
```

**What it does:** Add sponsor logos
- Get sponsors for this event
- If any exist → draw them at position (30, 30)

```javascript
    ctx.textAlign = 'left';
    const pos = getTextPositions(template.width, template.height);
```

**What it does:** Prepare for text drawing
- Set text alignment to left
- Get all text positions

```javascript
    // Draw header: "Merit" or "Participation"
    drawText(ctx, config.headerText, pos.headerTitle.x, pos.headerTitle.y, 
             FONTS.headerTitle.font, config.accentColor);
    
    // Draw "CERTIFICATE"
    drawText(ctx, 'CERTIFICATE', pos.headerCertificate.x, pos.headerCertificate.y, 
             FONTS.headerCertificate.font, FONTS.headerCertificate.color);
```

**What it does:** Draw header section
- Line 1: "Merit" (or "Participation") in accent color
- Line 2: "CERTIFICATE" in large black text

```javascript
    // Draw "This is to certify"
    drawText(ctx, 'This is to certify', pos.thisIsToCertify.x, pos.thisIsToCertify.y, 
             FONTS.label.font, FONTS.label.color);
    
    // Draw First Name
    drawText(ctx, participant.firstName || '', pos.firstName.x, pos.firstName.y, 
             FONTS.name.font, FONTS.name.color);
    
    // Draw Middle Name (only if exists)
    if (participant.middleName && participant.middleName.trim() !== '') {
        drawText(ctx, participant.middleName, pos.middleName.x, pos.middleName.y, 
                 FONTS.name.font, FONTS.name.color);
    }
    
    // Draw Last Name
    drawText(ctx, participant.lastName || '', pos.lastName.x, pos.lastName.y, 
             FONTS.name.font, FONTS.name.color);
```

**What it does:** Draw name section
- "This is to certify" (small text)
- First name (bold, 24px)
- Middle name (bold, 24px) - ONLY if provided
- Last name (bold, 24px)

```javascript
    // Draw rank and sport line
    if (config.isWinner) {
        // For Gold/Silver/Bronze: "for winning Gold in Badminton"
        drawMixedLine(ctx, pos.rankAndSport.x, pos.rankAndSport.y, [
            { text: 'for winning ', font: FONTS.body.font, color: FONTS.body.color },
            { text: config.rankText, font: FONTS.bold.font, color: config.accentColor },
            { text: ' in ', font: FONTS.body.font, color: FONTS.body.color },
            { text: participant.sport || '', font: FONTS.bold.font, color: FONTS.bold.color }
        ]);
    } else {
        // For Participation: "for participating in 100m Sprint as Athlete"
        const parts = [
            { text: 'for ', font: FONTS.body.font, color: FONTS.body.color },
            { text: config.rankText, font: FONTS.bold.font, color: config.accentColor },
            { text: ' in ', font: FONTS.body.font, color: FONTS.body.color },
            { text: participant.sport || '', font: FONTS.bold.font, color: FONTS.bold.color }
        ];
        
        // Add role if specified
        if (participant.role && participant.role.trim() !== '') {
            parts.push({ text: ' as ', font: FONTS.body.font, color: FONTS.body.color });
            parts.push({ text: participant.role, font: FONTS.bold.font, color: FONTS.bold.color });
        }
        
        drawMixedLine(ctx, pos.rankAndSport.x, pos.rankAndSport.y, parts);
    }
```

**What it does:** Draw rank/sport line with mixed styling

Winners: "for winning **Gold** in **Badminton**"
- "for winning " → regular
- "Gold" → bold + golden color
- " in " → regular
- "Badminton" → bold

Participants: "for **participating** in **100m Sprint** as **Athlete**"
- Similar but includes role if provided

```javascript
    // Draw remaining lines...
    drawMixedLine(ctx, pos.eventName.x, pos.eventName.y, [
        { text: 'at the ', font: FONTS.body.font, color: FONTS.body.color },
        { text: participant.eventName || '', font: FONTS.bold.font, color: FONTS.bold.color }
    ]);
    
    // ... organisation, association, dates
```

**What it does:** Draw event details with bold highlights
- Event name
- Organization name
- Association name
- Start date
- End date

All follow same pattern: regular text + bold highlights

```javascript
    // Draw certificate ID
    const certId = generateCertificateId(participant, index);
    drawText(ctx, `Certificate ID: ${certId}`, pos.certificateId.x, pos.certificateId.y, 
             FONTS.certId.font, FONTS.certId.color);
```

**What it does:** Add unique certificate ID at bottom
- Generate ID: "CERT-G0001-SP-ABC1"
- Draw in small monospace font

```javascript
    // Save as JPEG
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
    const safeFirstName = (participant.firstName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');
    const safeLastName = (participant.lastName || 'Unknown').replace(/[^a-zA-Z0-9]/g, '');
    const fileName = `${safeFirstName}_${safeLastName}_${participant.certificateType}.jpg`;
    const filePath = path.join(OUTPUT_DIR, fileName);
    
    fs.writeFileSync(filePath, buffer);
    console.log(`   ✅ Saved: ${fileName}`);
    
    return { filePath, certId, name: fullName, type: participant.certificateType };
}
```

**What it does:** Save certificate as image file
1. Convert canvas to JPEG (95% quality)
2. Create safe filename:
   - Remove special characters from names
   - Format: "Stuti_Patel_gold.jpg"
3. Save to output folder
4. Log success message
5. Return info about generated certificate

---

## **PART 9: MAIN EXECUTION (Lines 562-630)**

```javascript
(async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║           🎓 CERTIFICATE GENERATION ENGINE                    ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    console.log('');
```

**What it does:** Show fancy header box
- Self-executing async function
- Displays program title

```javascript
    // Parse participants CSV
    console.log(`📂 Reading CSV: ${CSV_FILE}`);
    const participants = parseCSV(CSV_FILE);
    
    if (participants.length === 0) {
        console.error('❌ No participants found in CSV. Exiting.');
        return;
    }
    
    console.log(`📊 Found ${participants.length} participant(s)`);
```

**What it does:** Load participant data
- Read CSV file
- Parse into array of objects
- If empty → show error and exit
- Show count

```javascript
    // Parse sponsors CSV
    console.log(`📂 Reading Sponsors: ${SPONSORS_CSV_FILE}`);
    const sponsorsByEvent = parseSponsorsCSV(SPONSORS_CSV_FILE);
    const totalSponsors = Object.values(sponsorsByEvent).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`🏢 Found ${totalSponsors} sponsor(s) across ${Object.keys(sponsorsByEvent).length} event(s)\n`);
```

**What it does:** Load sponsor data
- Read sponsors CSV
- Group by event
- Count total sponsors
- Count total events

```javascript
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
```

**What it does:** Generate all certificates
1. Create results object to group by type
2. Loop through each participant
3. Generate certificate
4. If successful:
   - Increment counter
   - Add to results by type

```javascript
    console.log('');
    console.log('═'.repeat(65));
    console.log(`✨ Generated ${successCount}/${participants.length} certificates successfully!`);
    console.log(`📁 Output folder: ${path.resolve(OUTPUT_DIR)}`);
    console.log('═'.repeat(65));
```

**What it does:** Show summary
- Line separator
- Success count vs total
- Output folder path

```javascript
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
    
    // ... bronze, participation
    
    console.log('');
})();
```

**What it does:** Show categorized summary
- List all Gold winners
- List all Silver winners
- List all Bronze winners
- List all Participants

Example:
```
🥇 GOLD (2):
   • Stuti Rajesh Patel
   • Amit Kumar
```

---

## 🎯 COMPLETE FLOW SUMMARY

1. **Setup:** Import libraries, define paths & configurations
2. **Load Data:** Read participants CSV + sponsors CSV
3. **Process Each Participant:**
   - Load correct template (gold/silver/bronze/participation)
   - Create blank canvas
   - Draw template background
   - Draw sponsor logos (top-left)
   - Draw header text (Merit/Participation + CERTIFICATE)
   - Draw participant name (first, middle, last)
   - Draw certificate details (rank, sport, event, etc.)
   - Generate & draw certificate ID
   - Save as JPEG file
4. **Report:** Show summary of all generated certificates

---

## 🔑 KEY CONCEPTS

### What is Canvas?
Think of it like Microsoft Paint but in code:
- You have a blank canvas (image)
- You use a context (ctx) like a paintbrush
- You can draw images, shapes, text on it
- Finally, you save it as a file

### What is Async/Await?
Some operations take time (loading images, reading files):
- `async` = This function does slow operations
- `await` = Wait for this to finish before continuing
- Allows code to not freeze while waiting

### What is Context (ctx)?
The "paintbrush" for drawing on canvas:
- `ctx.drawImage()` = Draw an image
- `ctx.fillText()` = Draw text
- `ctx.font` = Set font style
- `ctx.fillStyle` = Set color

### Why Mixed Line Drawing?
To have different styles in one line:
```
"for winning Gold in Badminton"
  regular    bold   regular  bold
```

Draw each part separately with its own style, placing them end-to-end.

---

This is the complete explanation of how the certificate generator works!
