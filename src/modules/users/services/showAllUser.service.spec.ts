/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import ShowAllUsersService from './showAllUser.service';
import type IUserRepository from '../repositories/IUserRepository';
import User from '../infra/knex/models/user.model';
import { IPagination } from 'src/@types/interfaces';

describe('ShowAllUsersService', () => {
  let service: ShowAllUsersService;
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

  const mockPaginatedResult: IPagination<User> = {
    data: [mockUser],
    from: 1,
    to: 1,
    total: 1,
    pages: 1,
  };

  const mockRequest = { page: 1, onlyActives: true };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowAllUsersService,
        {
          provide: 'UserRepository',
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockUser]),
          },
        },
      ],
    }).compile();

    service = module.get<ShowAllUsersService>(ShowAllUsersService);
    userRepository = module.get<IUserRepository>('UserRepository');
  });

  describe('execute', () => {
    it('Deve retornar uma lista de usuários com paginação e filtro de ativos', async () => {
      await service.execute(mockRequest.page, mockRequest.onlyActives);

      expect(userRepository.findAll).toHaveBeenCalledWith(1, true);
    });

    it('Deve retornar uma lista vazia quando não há usuários', async () => {
      jest.spyOn(userRepository, 'findAll').mockResolvedValueOnce([]);

      const result = await service.execute(
        mockRequest.page,
        mockRequest.onlyActives,
      );

      expect(userRepository.findAll).toHaveBeenCalledWith(1, true);
      expect(result).toEqual([]);
    });

    it('Deve retornar um objeto paginado quando o repositório usa paginação', async () => {
      jest
        .spyOn(userRepository, 'findAll')
        .mockResolvedValueOnce(mockPaginatedResult);

      const result = await service.execute(
        mockRequest.page,
        mockRequest.onlyActives,
      );

      expect(userRepository.findAll).toHaveBeenCalledWith(1, true);
      expect(result).toEqual(mockPaginatedResult);
    });
  });
});
