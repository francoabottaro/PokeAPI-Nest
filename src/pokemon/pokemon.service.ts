import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = configService.get<number>('defaultLimit');
  }
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      //* Create Pokemon
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  //* GetAll
  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offcest = 0 } = paginationDto;
    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offcest)
      .sort({ no: 1 })
      .select('-__v');
  }

  //* GetOne
  async findOne(paramSearch: string) {
    let pokemon: Pokemon;

    //? NO: Pokemon list number
    if (!isNaN(+paramSearch)) {
      pokemon = await this.pokemonModel.findOne({ no: paramSearch });
    }

    //? Id: MongoDB ID
    if (!pokemon && isValidObjectId(paramSearch)) {
      pokemon = await this.pokemonModel.findById(paramSearch);
    }

    //? name: Pokemon name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: paramSearch.toLowerCase
      });
    }

    //! Pokemon NotFound
    if (!pokemon)
      throw new NotFoundException(
        `Pokemon with id, name o 'no' not found: ${paramSearch}`
      );

    return pokemon;
  }

  // ? Patch
  async update(paramSearch: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(paramSearch);
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  // ! Delete
  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Pokemon with id ${id} not found`);
    return `delete complete`;
  }

  // Handler notFould
  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db ${JSON.stringify(error.keyValue)}`
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      "Can't update Pokemon - Check server logs"
    );
  }
}
