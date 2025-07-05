import { IsString, IsEnum, IsArray, ValidateNested, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class SubPartDto {
  @IsString()
  id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreatePartDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsEnum(['RAW', 'ASSEMBLED'])
  type: 'RAW' | 'ASSEMBLED';

  @ValidateNested({ each: true })
  @Type(() => SubPartDto)
  parts?: SubPartDto[];
}
