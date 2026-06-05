import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { CurrentUser } from 'src/modules/auth/presentation/decorators/current-user.decorator';
import { FindUserByIdUseCase } from '../application/find-user-by-id.use-case';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

  @Get('me')
  async getMe(@CurrentUser() user: { id: string }): Promise<UserResponseDto> {
    const entity = await this.findUserByIdUseCase.execute(user.id);
    return UserResponseDto.fromEntity(entity);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const entity = await this.findUserByIdUseCase.execute(id);
    return UserResponseDto.fromEntity(entity);
  }
}
