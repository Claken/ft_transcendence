import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class DmDto {
	
@IsOptional()
@IsNumber()
id: number;

@IsString()
sender: string;

@IsString()
receiver: string;

@IsOptional()
@IsString()
message: string;

@IsOptional()
@IsBoolean()
read: boolean;
}