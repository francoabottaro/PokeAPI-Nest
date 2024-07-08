import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      //* Create Pokemon
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon exists in db ${JSON.stringify(error.keyValue)}`
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        "Can't create Pokemon - Check server logs"
      );
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

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

  async update(paramSearch: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(paramSearch);
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
      }

      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
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

  remove(id: string) {
    return `This action removes a #${id} pokemon`;
  }
}
