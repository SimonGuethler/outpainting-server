import express, { Express, Request, Response } from 'express';
import { Database } from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const app: Express = express();
const port = 8888;

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req: Request, res: Response) => {
    res.send('Server');
});

interface DBEntry {
    id: number;
    prompt: string;
    source: string;
    image: string;
    date: string;
    headline: string;
}

type EntryReturn = Omit<DBEntry, 'id'>;

app.use('/image', express.static(path.join(__dirname, '..', 'public')));

app.get('/data/:folderName', (req, res) => {
    const folderName = req.params.folderName;
    const dbFile = path.join(__dirname, '..', 'public', folderName, 'sqlite.db');

    if (!fs.existsSync(dbFile)) {
        return res.sendStatus(404);
    }

    const db = new Database(dbFile);

    db.all('SELECT * FROM entries', (err, rows: DBEntry[]) => {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        if (rows.length === 0) {
            return res.sendStatus(404);
        }

        const base_url = `${req.protocol}://${req.get('host')}/image/${folderName}/`;
        const result: EntryReturn[] = [];
        rows.forEach((row) => {
            result.push({
                image: base_url + row.image + '.webp',
                prompt: row.prompt.trim(),
                headline: row.headline.trim(),
                source: row.source.trim(),
                date: row.date.trim(),
            });
        });

        res.json(result);
    });
});
