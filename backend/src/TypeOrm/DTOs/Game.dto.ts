import { IsOptional } from 'class-validator';

export class GameDTO {
	@IsOptional()
	id?: number;
	
	@IsOptional()
	loginLP?: string;
	
	@IsOptional()
	loginRP?: string;

	@IsOptional()
	nameLP?: string;
	
	@IsOptional()
	nameRP?: string;
	
	@IsOptional()
	scoreLP?: number;
	
	@IsOptional()
	scoreRP?: number;

	@IsOptional()
	compteur?: number = 10;

	@IsOptional()
	map?: number = 0;

	@IsOptional()
	state?: number = 0;
	
	@IsOptional()
	abort?: string;
	
	@IsOptional()
	isFinish?: boolean;

	@IsOptional()
	date?: Date;

	@IsOptional()
	waitingForOppenent?: boolean;
}
