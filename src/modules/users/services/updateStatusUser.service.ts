import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import type IUserRepository from '../repositories/IUserRepository';
import User from '../infra/knex/models/user.model';

interface IRequest {
  user_id: string;
  status: string;
}

@Injectable()
class UpdateStatusUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ user_id, status }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new RpcException('User not found');
    }

    user.status = status;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateStatusUserService;
