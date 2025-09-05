/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import DeleteUserService from './deleteUser.service';
import type IUserRepository from '../repositories/IUserRepository';
import User from '../infra/knex/models/user.model';

describe('DeleteUserService', () => {
  let service: DeleteUserService;
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

  const mockRequest = { user_id: '1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: 'UserRepository',
          useValue: {
            findById: jest.fn().mockResolvedValue(mockUser),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
    userRepository = module.get<IUserRepository>('UserRepository');
  });

  describe('execute', () => {
    it('Deve deletar um usuário quando ele existe', async () => {
      await service.execute(mockRequest);

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.delete).toHaveBeenCalledWith('1');
    });

    it('Deve lançar RpcException quando o usuário não existe', async () => {
      jest.spyOn(userRepository, 'findById').mockResolvedValueOnce(undefined);

      await expect(service.execute(mockRequest)).rejects.toThrow(
        new RpcException('User not found'),
      );
      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(userRepository.delete).not.toHaveBeenCalled();
    });
  });
});
