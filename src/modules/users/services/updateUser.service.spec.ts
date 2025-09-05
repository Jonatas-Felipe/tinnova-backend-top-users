/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import UpdateUserService from './updateUser.service';
import type IUserRepository from '../repositories/IUserRepository';
import User from '../infra/knex/models/user.model';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

describe('UpdateUserService', () => {
  let service: UpdateUserService;
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

  const mockRequest: IUpdateUserDTO = {
    user_id: '1',
    nome: 'Alice Updated',
    email: 'alice.updated@example.com',
    rua: 'Rua Nova',
    numero: '456',
    bairro: 'Jardins',
    complemento: 'Apto 5',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    cep: '98765-432',
    status: 'inactive',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: 'UserRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockUser),
            save: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
    userRepository = module.get<IUserRepository>('UserRepository');
  });

  describe('execute', () => {
    it('Deve atualizar um usuário quando ele existe', async () => {
      const result = await service.execute(mockRequest);

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        nome: 'Alice Updated',
        email: 'alice.updated@example.com',
        rua: 'Rua Nova',
        numero: '456',
        bairro: 'Jardins',
        complemento: 'Apto 5',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '98765-432',
        status: 'inactive',
      });
      expect(result).toEqual({
        ...mockUser,
        nome: 'Alice Updated',
        email: 'alice.updated@example.com',
        rua: 'Rua Nova',
        numero: '456',
        bairro: 'Jardins',
        complemento: 'Apto 5',
        cidade: 'Rio de Janeiro',
        estado: 'RJ',
        cep: '98765-432',
        status: 'inactive',
      });
    });

    it('Deve lançar RpcException quando o usuário não existe', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.execute(mockRequest)).rejects.toThrow(
        new RpcException('User not found'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });
});
