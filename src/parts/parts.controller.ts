import { Controller, Post, Param, Body } from '@nestjs/common';
import { PartsService } from './parts.service';
import { CreatePartDto } from './dto/create-part.dto';
import { successResponse } from 'src/utils/api-response';

@Controller('api/v1/part')
export class PartsController {
    constructor(private readonly partsService: PartsService) { }

    @Post()
    async createPart(@Body() createPartDto: CreatePartDto) {
        const data = await this.partsService.createPart(createPartDto);
        return successResponse('Part created successfully!', data, 201);
    }

    @Post(':id')
    async addToInventory(@Param('id') id: string, @Body() body: { quantity: number }) {
        const data = await this.partsService.addToInventory(id, body.quantity);
        return successResponse('Part added successfully!', data, 200);
    }
}