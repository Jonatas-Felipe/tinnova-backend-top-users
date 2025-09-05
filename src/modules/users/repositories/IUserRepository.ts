import { IPagination } from 'src/@types/interfaces';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/knex/models/user.model';

export default interface IUserRepository {
  findAll(
    page: number | undefined,
    onlyActives: boolean | undefined,
  ): Promise<User[] | IPagination<User>>;
  findById(id: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(data: User): Promise<User>;
  delete(id: string): Promise<void>;
}
