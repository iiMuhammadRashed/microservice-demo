import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { createClient } from 'micro-requester';

class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;
}

class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;
}

@Controller('users')
export class UsersController {
  private readonly usersClient = createClient({
    service: 'users-service',
    base: process.env.USERS_SERVICE_HTTP_URL || 'http://localhost:3001',
    timeoutMs: Number(process.env.USERS_HTTP_TIMEOUT_MS || 5000),
    retries: Number(process.env.USERS_HTTP_RETRIES || 2),
  });

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateUserDto) {
    this.logIncomingRequest('POST', '/users', dto);
    return this.usersClient.post('/users', dto);
  }

  @Get()
  findAll() {
    this.logIncomingRequest('GET', '/users');
    return this.usersClient.get('/users');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logIncomingRequest('GET', `/users/${id}`);
    return this.usersClient.get(`/users/${id}`);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    this.logIncomingRequest('PUT', `/users/${id}`, dto);
    return this.usersClient.put(`/users/${id}`, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deactivate(@Param('id') id: string): Promise<void> {
    this.logIncomingRequest('DELETE', `/users/${id}`);
    await this.usersClient.delete(`/users/${id}`);
  }

  private logIncomingRequest(method: string, path: string, data?: unknown): void {
    if (typeof data !== 'undefined') {
      console.log(`[API Gateway] ${method} ${path} | data:`, data);
      return;
    }

    console.log(`[API Gateway] ${method} ${path}`);
  }
}
