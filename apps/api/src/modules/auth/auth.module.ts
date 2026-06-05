import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user/user.module';
import { JwtAuthGuard } from 'src/shared/guards/jwt.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtStrategy } from 'src/shared/strategies/jwt.strategy';
import { RegisterUseCase } from './application/register.use-case';
import { LoginUseCase } from './application/login.use-case';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '8h' },
    }),
  ],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
