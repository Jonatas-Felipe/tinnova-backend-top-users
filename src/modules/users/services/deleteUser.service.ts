import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import type IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  user_id: string;
}

@Injectable()
class deleteUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<void> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new RpcException('User not found');
    }

    return this.userRepository.delete(user_id);
  }
}

export default deleteUserService;
