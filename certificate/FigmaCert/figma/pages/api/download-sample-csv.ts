import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

// Runtime bridge to certificate-engine
const bridge = require('../../lib/certificate-engine/bridge');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const assetPaths = bridge.getEngineAssetPaths();

    if (!fs.existsSync(assetPaths.participantsCsvPath)) {
        return res.status(404).json({ error: 'Sample CSV file not found' });
    }

    const csvContent = fs.readFileSync(assetPaths.participantsCsvPath, 'utf-8');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sample-participants.csv"');
    res.status(200).send(csvContent);
}
