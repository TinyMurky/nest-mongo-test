import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCatDto } from './dto/cat.dto';
import { CatsService } from './cats.service';
import { Cat } from 'src/Schema/cat.schema';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createCatDto: CreateCatDto): Promise<Cat> {
    const cat = await this.catsService.create(createCatDto);
    return cat;
  }

  @Get()
  async getAll(): Promise<Cat[]> {
    return this.catsService.getAll();
  }
}
