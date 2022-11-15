import { IsOptional } from 'class-validator';

export class GameDTO {
	@IsOptional()
	id?: number;
	
	@IsOptional()
	loginLP?: string;
	
	@IsOptional()
	loginRP?: string;
	
	@IsOptional()
	scoreLP?: number;
	
	@IsOptional()
	scoreRP?: number;
	
	@IsOptional()
	abort?: string;
	
	@IsOptional()
	isFinish?: boolean;

	@IsOptional()
	date?: Date;

	@IsOptional()
	waitingForOppenent?: boolean;
}