import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import type IUserRepository from '../repositories/IUserRepository';
import User from '../infra/knex/models/user.model';

interface IRequest {
  user_id: string;
}

@Injectable()
class showUserByIdService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new RpcException('User not found');
    }

    return user;
  }
}

export default showUserByIdService;
