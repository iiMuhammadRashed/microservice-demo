import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSG } from '../../shared/message-patterns';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @Inject('EMAIL_SERVICE')
    private readonly emailClient: ClientProxy,
  ) {}

  async create(data: { email: string; name: string }): Promise<User> {
    const existing = await this.repo.findOne({ where: { email: data.email } });
    if (existing) {
      throw new ConflictException(`Email ${data.email} already exists`);
    }

    const user = await this.repo.save(this.repo.create(data));

    this.emailClient.emit(MSG.EMAIL_SEND, {
      to: user.email,
      subject: 'Welcome to New-Demo',
      text: `Hello ${user.name}, your account has been created.`,
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async update(id: string, data: { name?: string }): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, data);
    return this.repo.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.repo.save(user);
  }
}
