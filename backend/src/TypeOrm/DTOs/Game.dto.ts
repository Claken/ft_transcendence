import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GameDTO {
	@IsOptional()
	id?: number;
	
	@IsOptional()
	@IsString()
	loginLP?: string;
	
	@IsOptional()
	@IsString()
	loginRP?: string;

	@IsOptional()
	@IsString()
	nameLP?: string;
	
	@IsOptional()
	@IsString()
	nameRP?: string;
	
	@IsOptional()
	@IsNumber()
	scoreLP?: number;
	
	@IsOptional()
	@IsNumber()
	scoreRP?: number;

	@IsOptional()
	compteur?: number = 10;

	@IsOptional()
	nbInter?: number = 0;

	@IsOptional()
	map?: number = 0;

	@IsOptional()
	state?: number = 0;

	@IsOptional()
	abort?: string;
	
	@IsOptional()
	@IsBoolean()
	isFinish?: boolean;

	@IsOptional()
	date?: Date;

	@IsOptional()
	waitingForOppenent?: boolean = true;

	@IsOptional()
	waitingForInvit?: boolean = false;
}
