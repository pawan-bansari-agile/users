import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class AppController {
  private logger = new Logger('AppController');

  constructor(private mathService: AppService) {}

  @GrpcMethod('UserController', 'CreateUser')
  async createUser(data: any) {
    console.log('data from createUser method', data);
    this.logger.log('creating a user with', data);
    return this.mathService.createUser(data);
  }

  @GrpcMethod('UserController', 'GetUser')
  async getUser(data: any) {
    console.log('data from getUser method', data);
    this.logger.log('getting a user with', data);
    return this.mathService.getUser(data.id);
  }

  @GrpcMethod('UserController', 'GetUsers')
  async getUsers() {
    console.log('data from getUsers method');
    this.logger.log('getting all user');
    return this.mathService.getUsers();
  }

  @GrpcMethod('UserController', 'UpdateUser')
  async updateUser(data: any) {
    console.log('log from user service update method');

    console.log('data from updateUser method', data);
    this.logger.log('updating a user with', data);
    return this.mathService.updateUser(data);
  }

  @GrpcMethod('UserController', 'DeleteUser')
  async deleteUser(data: any) {
    console.log('data from deleteUser method', data);
    this.logger.log('deleting a user with', data);
    const response = await this.mathService.deleteUser(data.id);
    console.log('✌️response user service controller --->', response);
    return response;
  }
}
