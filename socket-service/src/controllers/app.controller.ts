import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';

@Controller('stream-records')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/:id')
  async get(_id: string): Promise<string> {
    return '';
  }

  @Get('/')
  async getAll(): Promise<string[]> {
    return [];
  }
}
