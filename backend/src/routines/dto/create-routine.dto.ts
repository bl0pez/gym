import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class RoutineSetDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  sets: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  repetitions: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  weight?: number;

  // @IsString()
  // @IsOptional()
  // time?: string;

  // @IsString()
  // @IsOptional()
  // rest?: string;
}

export class CreateRoutineDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoutineSetDto)
  sets: RoutineSetDto[];

  @IsString()
  @IsOptional()
  observations?: string;
}
