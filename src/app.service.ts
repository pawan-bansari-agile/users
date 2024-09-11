import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import {
  GrpcNotFoundException,
  GrpcInvalidArgumentException,
  GrpcUnknownException,
  GrpcAlreadyExistsException,
} from 'nestjs-grpc-exceptions';

@Injectable()
export class AppService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getHello(): string {
    return 'Hello World!';
  }

  public accumulate(data: number[]): number {
    return (data || []).reduce((a, b) => Number(a) + Number(b));
  }

  async createUser(data) {
    try {
      console.log('log from createUser method in service', data);
      const user = new this.userModel(data);
      console.log('✌️user --->', user);
      await user.save();
      return { user };
    } catch (err) {
      if (err.code === 11000) {
        throw new GrpcAlreadyExistsException('User Already Exists');
      } else {
        throw new GrpcUnknownException('Unknown Error Occured');
      }
    }
  }

  async getUser(id: string) {
    try {
      console.log('log from getUser method in service', id);

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new GrpcInvalidArgumentException('Incorrect ID Format');
      }

      const user = await this.userModel.findById(id);
      console.log('✌️user --->', user);
      if (!user) {
        throw new GrpcNotFoundException('User Not Found.');
      }
      return { user };
    } catch (err) {
      throw new GrpcUnknownException('Unknown Error Occured');
    }
  }

  async getUsers() {
    try {
      console.log('log from getUsers method in service');
      const users = await this.userModel.find();
      return {
        users: users.map((user) => ({
          id: user._id.toString(),
          userName: user.userName,
          email: user.email,
          password: user.password,
        })),
      };
    } catch (err) {
      throw new GrpcUnknownException('Unknown Error Occured');
    }
  }

  async updateUser(data) {
    try {
      console.log('log from updateUser method in service', data);

      if (!data.id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new GrpcInvalidArgumentException('Incorrect ID format');
      }

      const user = await this.userModel.findById(data.id);
      if (!user) {
        throw new GrpcNotFoundException('User not found');
      }

      if (data.userName) user.userName = data.userName;
      if (data.email) user.email = data.email;

      await user.save();

      return { user };
    } catch (err) {
      throw new GrpcUnknownException(`Internal server error: ${err.message}`);
    }
  }

  async deleteUser(id: string) {
    try {
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new GrpcInvalidArgumentException('Incorrect ID format');
      }

      const result = await this.userModel.deleteOne({ _id: id }).exec();
      if (result.deletedCount === 0) {
        throw new GrpcNotFoundException('User not found');
      }

      return { success: true }; // Return a structured boolean response
    } catch (err) {
      throw new GrpcUnknownException(`Internal server error: ${err.message}`);
    }
  }
}
