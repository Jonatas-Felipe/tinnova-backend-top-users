/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import UsersController from './users.controller';
import ShowAllUsersService from '../../../services/showAllUser.service';
import CreateUserService from '../../../services/createUser.service';
import ShowUserByIdService from '../../../services/showUserById.service';
import UpdateUserService from '../../../services/updateUser.service';
import DeleteUserService from '../../../services/deleteUser.service';
import UpdateStatusUserService from '../../../services/updateStatusUser.service';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUpdateUserDTO from '../../../dtos/IUpdateUserDTO';
import User from '../../knex/models/user.model';

describe('UsersController', () => {
  let controller: UsersController;
  let showAllUsersService: ShowAllUsersService;
  let createUserService: CreateUserService;
  let showUserByIdService: ShowUserByIdService;
  let updateUserService: UpdateUserService;
  let deleteUserService: DeleteUserService;
  let updateStatusUserService: UpdateStatusUserService;

  const mockUser: User = {
    id: '1',
    nome: 'Alice',
    email: 'alice@example.com',
    rua: 'Rua Exemplo',
    numero: '123',
    bairro: 'Centro',
    complemento: 'Apto 4',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '12345-678',
    status: 'active',
    created_at: new Date('2025-09-05T12:41:35.681Z'),
    updated_at: new Date('2025-09-05T12:41:35.681Z'),
    deleted_at: undefined,
    is_deleted: false,
  };

  const mockCreateUserDto: ICreateUserDTO = {
    nome: 'Alice',
    email: 'alice@example.com',
    rua: 'Rua Exemplo',
    numero: '123',
    bairro: 'Centro',
    complemento: 'Apto 4',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '12345-678',
    status: 'active',
  };

  const mockUpdateUserDto: IUpdateUserDTO = {
    user_id: '1',
    nome: 'Alice Updated',
    email: 'alice.updated@example.com',
    rua: 'Rua Exemplo Updated',
    numero: '123 Updated',
    bairro: 'Centro Updated',
    complemento: 'Apto 4 Updated',
    cidade: 'São Paulo Updated',
    estado: 'SP Updated',
    cep: '12345-678 Updated',
    status: 'ativo',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: ShowAllUsersService,
          useValue: {
            execute: jest.fn().mockResolvedValue([mockUser]),
          },
        },
        {
          provide: CreateUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: ShowUserByIdService,
          useValue: {
            execute: jest.fn().mockImplementation(({ user_id }) => {
              if (user_id === '1') {
                return Promise.resolve(mockUser);
              }
              throw new Error('User not found');
            }),
          },
        },
        {
          provide: UpdateUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue({
              ...mockUser,
              ...mockUpdateUserDto,
              id: mockUpdateUserDto.user_id,
            }),
          },
        },
        {
          provide: DeleteUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
        {
          provide: UpdateStatusUserService,
          useValue: {
            execute: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    showAllUsersService = module.get<ShowAllUsersService>(ShowAllUsersService);
    createUserService = module.get<CreateUserService>(CreateUserService);
    showUserByIdService = module.get<ShowUserByIdService>(ShowUserByIdService);
    updateUserService = module.get<UpdateUserService>(UpdateUserService);
    deleteUserService = module.get<DeleteUserService>(DeleteUserService);
    updateStatusUserService = module.get<UpdateStatusUserService>(
      UpdateStatusUserService,
    );
  });

  describe('index', () => {
    it('Deve retornar uma lista de usuários', async () => {
      const payload = { page: 1, onlyActives: true };
      const result = await controller.index(payload);

      expect(showAllUsersService.execute).toHaveBeenCalledWith(1, true);
      expect(result).toEqual([mockUser]);
    });
  });

  describe('create', () => {
    it('Deve criar um novo usuário', async () => {
      const result = await controller.create(mockCreateUserDto);

      expect(createUserService.execute).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('show', () => {
    it('Deve exibir um usuário', async () => {
      const payload = { user_id: '1' };
      const result = await controller.show(payload);

      expect(showUserByIdService.execute).toHaveBeenCalledWith(payload);
      expect(result).toEqual(mockUser);
    });

    it('Deve retornar um erro se o usuário não for encontrado', async () => {
      const payload = { user_id: '999' };
      await expect(controller.show(payload)).rejects.toThrow('User not found');
      expect(showUserByIdService.execute).toHaveBeenCalledWith(payload);
    });
  });

  describe('update', () => {
    it('Deve atualizar um usuário', async () => {
      const result = await controller.update(mockUpdateUserDto);

      expect(updateUserService.execute).toHaveBeenCalledWith(mockUpdateUserDto);
      expect(result).toMatchObject({
        id: '1',
        nome: 'Alice Updated',
        email: 'alice.updated@example.com',
        rua: 'Rua Exemplo Updated',
        numero: '123 Updated',
        bairro: 'Centro Updated',
        complemento: 'Apto 4 Updated',
        cidade: 'São Paulo Updated',
        estado: 'SP Updated',
        cep: '12345-678 Updated',
        status: 'ativo',
      });
    });
  });

  describe('delete', () => {
    it('Deve deletar um usuário', async () => {
      const payload = { user_id: '1' };
      const result = await controller.delete(payload);

      expect(deleteUserService.execute).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ success: true });
    });
  });

  describe('patch', () => {
    it('Deve atualizar o status de um usuário', async () => {
      const payload = { user_id: '1', status: 'inactive' };
      const result = await controller.patch(payload);

      expect(updateStatusUserService.execute).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ success: true });
    });
  });
});
