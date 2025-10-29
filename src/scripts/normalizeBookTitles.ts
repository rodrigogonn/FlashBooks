require('dotenv').config();

import { database } from '../database';
import { BookModel } from '../models/book';
import { toTitleCase } from '../utils/titleCase';

async function main() {
  await database.connect();

  const cursor = BookModel.find({}).cursor();
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for await (const doc of cursor) {
    try {
      const currentTitle: string = doc.title || '';
      const normalized = toTitleCase(currentTitle);

      if (normalized === currentTitle) {
        skipped += 1;
        continue;
      }

      // Check possible unique constraint conflict
      const conflict = await BookModel.findOne({
        title: normalized,
        _id: { $ne: doc._id },
      });
      if (conflict) {
        // If conflict, append a suffix with doc short id to keep uniqueness
        const shortId = String(doc._id).slice(-6);
        const uniqueTitle = `${normalized} (${shortId})`;
        await BookModel.updateOne(
          { _id: doc._id },
          { $set: { title: uniqueTitle } }
        );
      } else {
        await BookModel.updateOne(
          { _id: doc._id },
          { $set: { title: normalized } }
        );
      }

      updated += 1;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to normalize title for', doc._id, err);
      failed += 1;
    }
  }

  // eslint-disable-next-line no-console
  console.log(
    `Done. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`
  );
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main();
