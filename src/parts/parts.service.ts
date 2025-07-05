import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePartDto } from './dto/create-part.dto';
import { Part, PartDocument } from './schema/part.schema';
import { ApiError } from '../utils/api-error';
import { generateCustomId } from '../utils/generate-id.util';
@Injectable()
export class PartsService {
  constructor(
    @InjectModel(Part.name) private partModel: Model<PartDocument>,
  ) { }
  async createPart(dto: CreatePartDto) {
    try {

      const { name, type, parts = [] } = dto;

      if (type === 'ASSEMBLED') {
        const updates: Promise<PartDocument>[] = [];

        for (const p of parts) {
          const found = await this.partModel.findOne({ id: p.id });

          if (!found) {
            throw new ApiError(400, `Constituent part ${p.id} not found`);
          }

          updates.push(found.save());
        }

        const result = await this.detectCycle(null, parts.map((p) => p.id));
        if (result.hasCycle) {
          throw new ApiError(400, `Circular dependency detected: ${result.cyclePath?.join(' -> ')}`);
        }
        await Promise.all(updates);
      }

      const newId = await generateCustomId(this.partModel, name);

      const created = new this.partModel({
        id: newId,
        name,
        type,
        parts,
      });

      const saved = await created.save();
      return saved;
    } catch (error) {
      console.log("error", error)
      if (error.code === 11000) {
        if (error.keyPattern?.name) {
          throw new ApiError(400, `Part with name '${dto.name}' already exists.`);
        }
        if (error.keyPattern?.id) {
          throw new ApiError(400, `Part with id '${error.keyValue?.id}' already exists.`);
        }

        throw new ApiError(400, "Duplicate entry found.");
      }
      throw new ApiError(500, "Internal server error");
    }
  }


  async addToInventory(partId: string, quantity: number) {
    try {

      const part = await this.partModel.findOne({ id: partId });
      if (!part) throw new ApiError(404, 'Part not found');

      if (part.type === 'RAW') {
        part.quantity += quantity;
        await part.save();
        return { quantity: part.quantity };
      }

      const requiredParts = await this.resolveAllConstituentParts(part, quantity);
      console.log("requiredParts", requiredParts)

      for (const item of requiredParts) {
        if (item.available < item.required) {
          throw new ApiError(400, `Insufficient quantity - ${item.name}`);
        }
      }

      for (const item of requiredParts) {
        await this.partModel.updateOne(
          { id: item.id },
          { $inc: { quantity: -item.required } },
        );
      }

      part.quantity += quantity;
      return await part.save();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
    }
  }

  private async resolveAllConstituentParts(part: PartDocument, quantity: number) {
    const requirements = new Map<string, {
      id: string;
      name: string;
      required: number;
      available: number;
    }>();

    const traverse = async (p: PartDocument, multiplier: number) => {
      for (const sub of p.parts) {
        const subPart = await this.partModel.findOne({ id: sub.id });
        if (!subPart) throw new ApiError(404, `Part ${sub.id} not found`);

        const totalQty = sub.quantity * multiplier;

        if (subPart.type === 'RAW') {
          const existing = requirements.get(sub.id);
          if (existing) {
            existing.required += totalQty;
          } else {
            requirements.set(sub.id, {
              id: sub.id,
              name: subPart.name,
              required: totalQty,
              available: subPart.quantity,
            });
          }
        } else {
          await traverse(subPart, totalQty);
        }
      }
    };

    await traverse(part, quantity);

    return Array.from(requirements.values());
  }

  private async detectCycle(
    currentId: string | null,
    childrenIds: string[],
    visited = new Set<string>(),
    path: string[] = []
  ): Promise<{ hasCycle: boolean; cyclePath?: string[] }> {
    for (const id of childrenIds) {
      if (visited.has(id)) {
        return { hasCycle: true, cyclePath: [...path, id] };
      }

      visited.add(id);
      path.push(id);

      const child = await this.partModel.findOne({ id });
      if (!child) {
        visited.delete(id);
        path.pop();
        continue;
      }

      const nextLevel = child.parts?.map((p) => p.id) || [];

      const result = await this.detectCycle(id, nextLevel, visited, path);
      if (result.hasCycle) {
        return result;
      }

      visited.delete(id);
      path.pop();
    }

    return { hasCycle: false };
  }
}
