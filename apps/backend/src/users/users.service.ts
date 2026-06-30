import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByIdentifier(identifier: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ identifier }).exec();
  }

  async create(userDto: { identifier: string; passwordHash: string; name?: string; role?: string }): Promise<UserDocument> {
    const createdUser = new this.userModel(userDto);
    return createdUser.save();
  }

  async findOrCreateGoogleUser(userDto: { identifier: string; name: string; avatarUrl?: string; googleId: string; role?: string }): Promise<UserDocument> {
    let user = await this.userModel.findOne({ identifier: userDto.identifier }).exec();
    if (!user) {
      user = new this.userModel({
        identifier: userDto.identifier,
        googleId: userDto.googleId,
        name: userDto.name,
        avatarUrl: userDto.avatarUrl,
        role: userDto.role || 'athlete',
      });
      await user.save();
    } else if (!user.googleId) {
      user.googleId = userDto.googleId;
      if (!user.avatarUrl && userDto.avatarUrl) {
        user.avatarUrl = userDto.avatarUrl;
      }
      await user.save();
    }
    return user;
  }
}
