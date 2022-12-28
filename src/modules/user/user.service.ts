import { Injectable, Logger } from '@nestjs/common';

import { Cache } from '@cache';
import { ConfigurationService } from '@configurationservice';

import { UserRepository } from './repositories/user.repository';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly userRepository: UserRepository,
  ) {}

  @Cache({ keyPrefix: 'address', ttl: 1000 * 60 * 5 })
  async getAddress(param: string): Promise<string> {
    return param;
  }

  async getUsers() {
    const address = await this.getAddress('PARIS');
    Logger.log('**** This is the cached address value **** : ', address);
    return this.userRepository.find({
      where: { address: address },
    });
  }

  async addUser(userDto: UserDto) {
    const user = this.userRepository.create({ ...userDto });
    const userAdded = await this.userRepository.save(user);
    return this.userRepository.findByIds([userAdded.id]);
  }
}
