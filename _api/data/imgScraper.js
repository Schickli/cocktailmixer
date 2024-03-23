const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');
const stream = require('stream');

async function scrapeImages() {
    const db = new sqlite3.Database('data/cocktail.db', (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the cocktail database.');
    });

    let sql = `SELECT strDrinkThumb, idDrink FROM cocktails`;
    db.all(sql, [], async (err, rows) => {
        if (err) {
            throw err;
        }

        for (const row of rows) {
            console.log(row.strDrinkThumb);
            const url = row.strDrinkThumb;
            const ext = path.extname(url);
            const filename = path.basename(url);
            const filepath = path.join(__dirname, 'images', row.idDrink + ".jpg");

            try {
                const response = await fetch(url);

                // Use stream.pipeline to handle the stream and write it to the file
                await new Promise((resolve, reject) => {
                    const fileStream = fs.createWriteStream(filepath);
                    stream.pipeline(response.body, fileStream, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });

                console.log('Image saved to: ' + filepath);
            } catch (error) {
                console.error('Error downloading image:', error);
            }
        }

        db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Closed the database connection.');
        });
    });
}

module.exports = {
    scrapeImages,
};
