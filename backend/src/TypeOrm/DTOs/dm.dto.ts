import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class DmDto {
	
@IsOptional()
@IsNumber()
id?: number;

@IsString()
sender: string;

@IsString()
receiver: string;

@IsOptional()
@IsNumber()
senderId?: number;

@IsOptional()
@IsNumber()
receiverId?: number;

@IsOptional()
@IsString()
message?: string;

@IsOptional()
@IsBoolean()
read?: boolean;

@IsOptional()
date?: Date;
}