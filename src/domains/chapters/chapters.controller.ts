import { Controller } from '@nestjs/common';
import { ChaptersService } from './chapters.service';

@Controller()
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}
}
