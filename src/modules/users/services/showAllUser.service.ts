import { Inject, Injectable } from '@nestjs/common';
import type IUserRepository from '../repositories/IUserRepository';
import User from '../infra/knex/models/user.model';
import { IPagination } from 'src/@types/interfaces';

@Injectable()
class ShowAllUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    page: number | undefined,
    onlyActives: boolean | undefined,
  ): Promise<User[] | IPagination<User>> {
    const users = await this.userRepository.findAll(page, onlyActives);

    return users;
  }
}

export default ShowAllUserService;
