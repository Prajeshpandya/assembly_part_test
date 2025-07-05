import { Model } from 'mongoose';

export async function generateCustomId(
  model: Model<any>,
  baseName: string,
): Promise<string> {
  const baseId = baseName.toLowerCase().replace(/\s+/g, '-');

  const regex = new RegExp(`^${baseId}-(\\d+)$`, 'i');
  const existingDocs = await model.find({ name: { $regex: regex } }).select('id');

  const maxSuffix = existingDocs.reduce((max: number, doc: any) => {
    const match = doc._id.match(/-(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return Math.max(max, num);
  }, 0);

  return `${baseId}-${maxSuffix + 1}`;
}
