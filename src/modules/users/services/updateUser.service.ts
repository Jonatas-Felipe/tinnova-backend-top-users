import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import type IUserRepository from '../repositories/IUserRepository';
import IRequest from '../dtos/IUpdateUserDTO';
import User from '../infra/knex/models/user.model';

@Injectable()
class UpdateUserService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute({
    user_id,
    nome,
    email,
    rua,
    numero,
    bairro,
    complemento,
    cidade,
    estado,
    cep,
    status,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new RpcException('User not found');
    }

    user.nome = nome;
    user.email = email;
    user.rua = rua;
    user.numero = numero;
    user.bairro = bairro;
    user.complemento = complemento;
    user.cidade = cidade;
    user.estado = estado;
    user.cep = cep;
    user.status = status;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserService;
