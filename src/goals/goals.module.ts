import { Module } from '@nestjs/common';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Goals } from './goals.entity';
import { User } from '../user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { History } from '../history/history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Goals, User, History]), ConfigModule.forRoot(), 
  PassportModule.register({defaultStrategy: 'jwt'}),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET_KEY'),
      signOptions: {expiresIn: '1d'}
    })
  })
],
  controllers: [GoalsController],
  providers: [GoalsService]
})
export class GoalsModule {}
