import { Knex } from 'knex';

import knex from '../../../../../shared/infra/knex';
import User from '../models/user.model';
import ICreateUserDTO from '../../../dtos/ICreateUserDTO';
import IUserRepository from '../../../repositories/IUserRepository';
import { IPagination } from 'src/@types/interfaces';

class UsersRepository implements IUserRepository {
  private knex: Knex;

  constructor() {
    this.knex = knex;
  }

  public async findAll(
    page: number | undefined,
  ): Promise<User[] | IPagination<User>> {
    let users = this.knex<User>('users')
      .where({ is_deleted: false })
      .orderBy([{ column: 'created_at', order: 'asc' }]);

    if (page) {
      const totalData = (await this.knex<User>('users')
        .where({ is_deleted: false })
        .count('*')
        .first()) as unknown as { count: string };

      const total = parseInt(totalData.count, 10);

      let from = 0;
      let to = 0;

      const skipCount = (page - 1) * 8;
      from = (page - 1) * 8 + 1;
      to = Math.min(from + 8 - 1, total);
      users = users.offset(skipCount).limit(8);

      const userData: IPagination<User> = {
        data: await users.select('*'),
        from,
        to,
        total,
        pages: Math.ceil(total / 8),
      };

      return userData;
    }

    return users.select('*');
  }

  public async findById(id: string): Promise<User | undefined> {
    return this.knex<User>('users').where({ id, is_deleted: false }).first();
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const [user] = await this.knex<User>('users').insert(data).returning('*');

    return user;
  }

  public async save(user: User): Promise<User> {
    const [updated] = await this.knex<User>('users')
      .where({ id: user.id })
      .update({ ...user, updated_at: this.knex.fn.now() })
      .returning('*');

    return updated;
  }

  public async delete(id: string): Promise<void> {
    const user = await this.knex<User>('users').where({ id }).first();
    await this.knex<User>('users')
      .where({ id })
      .update({
        email: `${user?.email}-${id}-deleted`,
        deleted_at: this.knex.fn.now(),
        is_deleted: true,
      });
  }
}

export default UsersRepository;
