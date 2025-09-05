import { Controller } from '@nestjs/common';

import { MessagePattern, Payload } from '@nestjs/microservices';

import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUpdateUserDTO from '../../../dtos/IUpdateUserDTO';

import ShowAllUsersService from '../../../services/showAllUser.service';
import CreateUserService from '../../../services/createUser.service';
import ShowUserByIdService from '../../../services/showUserById.service';
import UpdateUserService from '../../../services/updateUser.service';
import DeleteUserService from '../../../services/deleteUser.service';
import UpdateStatusUserService from '../../../services/updateStatusUser.service';

@Controller('users')
class UsersController {
  constructor(
    private readonly showAllUsersService: ShowAllUsersService,
    private readonly createUserService: CreateUserService,
    private readonly showUserByIdService: ShowUserByIdService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
    private readonly updateStatusUserService: UpdateStatusUserService,
  ) {}

  @MessagePattern({ cmd: 'users_find_all' })
  async index(@Payload() { page }: { page: number | undefined }) {
    const users = await this.showAllUsersService.execute(page);

    return users;
  }

  @MessagePattern({ cmd: 'users_create' })
  create(@Payload() body: ICreateUserDTO) {
    const {
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
    } = body;

    return this.createUserService.execute({
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
    });
  }

  @MessagePattern({ cmd: 'users_find' })
  async show(@Payload() { user_id }: { user_id: string }) {
    return this.showUserByIdService.execute({
      user_id,
    });
  }

  @MessagePattern({ cmd: 'users_update' })
  update(@Payload() data: IUpdateUserDTO) {
    const {
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
    } = data;

    return this.updateUserService.execute({
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
    });
  }

  @MessagePattern({ cmd: 'users_delete' })
  async delete(@Payload() { user_id }: { user_id: string }) {
    await this.deleteUserService.execute({
      user_id,
    });

    return { success: true };
  }

  @MessagePattern({ cmd: 'users_patch' })
  async patch(
    @Payload() { user_id, status }: { user_id: string; status: string },
  ) {
    await this.updateStatusUserService.execute({
      user_id,
      status,
    });

    return { success: true };
  }
}

export default UsersController;
