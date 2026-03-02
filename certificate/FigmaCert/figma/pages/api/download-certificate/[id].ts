import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Certificate ID is required' });
    }

    // Sanitize filename to prevent directory traversal
    const safeId = id.replace(/[^a-zA-Z0-9._-]/g, '');
    const certPath = path.resolve(
        process.cwd(), 'public', 'generated-certificates', safeId
    );

    // Ensure the file is within the expected directory
    const expectedDir = path.resolve(process.cwd(), 'public', 'generated-certificates');
    if (!certPath.startsWith(expectedDir)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    if (!fs.existsSync(certPath)) {
        return res.status(404).json({ error: `Certificate not found: ${safeId}` });
    }

    // Determine content type
    const ext = path.extname(certPath).toLowerCase();
    const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';

    const fileBuffer = fs.readFileSync(certPath);

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${safeId}"`);
    res.setHeader('Content-Length', fileBuffer.length);
    res.status(200).send(fileBuffer);
}
