import { Get, Param, Controller } from '@nestjs/common';
import { DmEntity } from 'src/TypeOrm';
import { DmService } from './dm.service';

@Controller('dm')
export class DmController {
	constructor(private readonly dmService: DmService) {}

  @Get()
	async historyDm(): Promise<DmEntity[]> {
    return await this.dmService.historyDm();
  }

	@Get(':me/:target')
  async getByName(@Param('me') me: number, @Param('target') target: number): Promise<DmEntity[]> {
    return await this.dmService.getByName(me, target);
  }

	@Get(':me/:target/read')
	async getRead(@Param('me') me: number, @Param('target') target: number): Promise<number> {
		return await this.dmService.getRead(me, target);
	}
}
