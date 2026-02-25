# Placeholder Sponsor Logo Generator

Since we don't have actual sponsor logos, here's how to create test logos:

## Option 1: Create Simple PNG Placeholders Using Node.js

Run this script to generate placeholder logos:

```javascript
const { createCanvas } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

const sponsors = [
    { name: 'TechCorp', color: '#3498db', file: 'techcorp.png' },
    { name: 'Innovation Labs', color: '#e74c3c', file: 'innovation_labs.png' },
    { name: 'Digital Future', color: '#2ecc71', file: 'digital_future.png' },
    { name: 'BrainPower', color: '#9b59b6', file: 'brainpower.png' },
    { name: 'Strategic Minds', color: '#f39c12', file: 'strategic_minds.png' },
    { name: 'AquaTech', color: '#1abc9c', file: 'aquatech.png' },
    { name: 'WaterSports', color: '#34495e', file: 'watersports.png' },
    { name: 'Marine', color: '#16a085', file: 'marine.png' },
    { name: 'Sports Auth', color: '#c0392b', file: 'sports_auth.png' },
    { name: 'Football Fed', color: '#27ae60', file: 'football_fed.png' },
    { name: 'Athletic Gear', color: '#2980b9', file: 'athletic_gear.png' },
    { name: 'Campus Sports', color: '#8e44ad', file: 'campus_sports.png' },
    { name: 'Tennis Excel', color: '#d35400', file: 'tennis_excellence.png' },
    { name: 'Racket Masters', color: '#c0392b', file: 'racket_masters.png' },
    { name: 'Target Pro', color: '#16a085', file: 'target_pro.png' },
    { name: 'Paddle Champs', color: '#2c3e50', file: 'paddle_champs.png' },
    { name: 'TableTech', color: '#e67e22', file: 'tabletech.png' },
    { name: 'VolleyPro', color: '#3498db', file: 'volleypro.png' }
];

sponsors.forEach(sponsor => {
    const canvas = createCanvas(150, 150);
    const ctx = canvas.getContext('2d');
    
    // Background circle
    ctx.fillStyle = sponsor.color;
    ctx.beginPath();
    ctx.arc(75, 75, 65, 0, Math.PI * 2);
    ctx.fill();
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const words = sponsor.name.split(' ');
    words.forEach((word, i) => {
        ctx.fillText(word, 75, 65 + (i - words.length / 2 + 0.5) * 20);
    });
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, 'assets', 'sponsors', sponsor.file), buffer);
    console.log(`Created: ${sponsor.file}`);
});
```

Save this as `generate-sponsor-logos.js` and run: `node generate-sponsor-logos.js`

## Option 2: Manual Placeholders

Create simple colored circles with text using any image editor (Canva, Photoshop, etc.)
- Size: 150x150 px
- Format: PNG with transparency
- Design: Circle with sponsor name

## Option 3: Skip for Now

The code will warn if logos are missing but continue generating certificates without them.
