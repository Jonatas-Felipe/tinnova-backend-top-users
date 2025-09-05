import { Module } from '@nestjs/common';

import UsersController from './infra/http/controllers/users.controller';
import UserRepository from './infra/knex/repositories/user.repository';
import ShowAllUsersService from './services/showAllUser.service';
import CreateUserService from './services/createUser.service';
import ShowUserByIdService from './services/showUserById.service';
import UpdateUserService from './services/updateUser.service';
import DeleteUserService from './services/deleteUser.service';
import UpdateStatusUserService from './services/updateStatusUser.service';

@Module({
  controllers: [UsersController],
  providers: [
    ShowAllUsersService,
    CreateUserService,
    ShowUserByIdService,
    UpdateUserService,
    DeleteUserService,
    UpdateStatusUserService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
})
class UsersModule {}

export default UsersModule;
