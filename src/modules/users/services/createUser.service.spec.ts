/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import CreateUserService from './createUser.service';
import type IUserRepository from '../repositories/IUserRepository';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/knex/models/user.model';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let userRepository: IUserRepository;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: 'UserRepository',
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
    userRepository = module.get<IUserRepository>('UserRepository');
  });

  describe('execute', () => {
    it('deve criar um usuário e retorná-lo', async () => {
      const result = await service.execute(mockCreateUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('deve lançar um erro se o repositório falhar', async () => {
      jest
        .spyOn(userRepository, 'create')
        .mockRejectedValueOnce(new Error('Email already exists'));

      await expect(service.execute(mockCreateUserDto)).rejects.toThrow(
        'Email already exists',
      );
      expect(userRepository.create).toHaveBeenCalledWith(mockCreateUserDto);
    });
  });
});
