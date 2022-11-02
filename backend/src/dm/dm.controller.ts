import { Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { DmEntity } from 'src/TypeOrm';
import { DmService } from './dm.service';

@Controller('dm')
export class DmController {
	constructor(private dmService: DmService) {}

  @Get()
	async historyDm(): Promise<DmEntity[]> {
    return await this.dmService.historyDm();
  }
}
