import { Inject, Injectable } from '@nestjs/common';
import type IUserRepository from '../repositories/IUserRepository';
import IRequest from '../dtos/ICreateUserDTO';
import User from '../infra/knex/models/user.model';

@Injectable()
class CreateUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: IRequest): Promise<User> {
    const user = await this.userRepository.create({
      ...data,
    });

    return user;
  }
}

export default CreateUserService;
