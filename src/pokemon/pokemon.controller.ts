import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll() {
    return this.pokemonService.findAll();
  }

  @Get(':paramSearch')
  findOne(@Param('paramSearch') paramSearch: string) {
    return this.pokemonService.findOne(paramSearch);
  }

  @Patch(':paramSearch')
  update(
    @Param('paramSearch') paramSearch: string,
    @Body() updatePokemonDto: UpdatePokemonDto
  ) {
    return this.pokemonService.update(paramSearch, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pokemonService.remove(id);
  }
}
