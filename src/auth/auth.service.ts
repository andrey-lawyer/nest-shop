import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';

import { RegisterDto } from './dto/register.dto';

import { User } from 'src/users/user.entity';
import { ITokenUser } from './types';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  //  create new user (admin if it is first)
  async create(registerDto: RegisterDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const newUser = this.userRepository.create({
      ...registerDto,
      password: await bcrypt.hash(registerDto.password, 10),
    });

    const userCount = await this.userRepository.count();
    if (userCount === 0) newUser.isAdmin = true;

    newUser.confirmationToken = randomUUID();

    await this.sendConfirmationEmail(newUser.email, newUser.confirmationToken);
    await this.userRepository.save(newUser);
    return { message: 'Verify your e-mail. Verify your e-mail.' };
  }

  async confirmEmail(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({
      confirmationToken: token,
    });

    if (!user) {
      throw new NotFoundException('User not found or already confirmed');
    }

    user.confirmationToken = null;
    await this.userRepository.save(user);
    return { message: 'Email successfully confirmed.' };
  }

  // for local(login) strategy
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOneBy({ email });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (user && isPasswordValid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any): Promise<ITokenUser | null> {
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });
    user.token = accessToken;
    return user;
  }

  async deleteUser(id: number): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
    return { message: `user with ${user.email} successfully removed.` };
  }

  // user forgot password
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.resetPasswordToken = randomUUID();

    await this.sendPasswordResetEmail(user.email, user.resetPasswordToken);
    return { message: `Check your e-mail.` };
  }
  // reset password by email
  private async sendPasswordResetEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const resetLink = `${process.env.BASE_URL_FRONT}/new-password/${token}`;
    const html = `<a target="_blank" href="${resetLink}">Click link to reset password</a>`;

    return await this.sendEmail(email, 'password reset request', html);
  }

  // new password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOneBy({
      resetPasswordToken: token,
    });
    if (!user) {
      throw new NotFoundException('Invalid or expired token');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    await this.userRepository.save(user);
  }
  // confirm email
  private async sendConfirmationEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const confirmationLink = `${process.env.API_HOST}${process.env.PORT}/auth/confirm-email/${token}`;
    const html = `<a target="_blank" href="${confirmationLink}">Click link to confirm email</a>`;

    await this.sendEmail(email, 'e-mail confirmation', html);
  }

  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        from: process.env.MAIL_USER,
        subject,
        html,
      });
    } catch (error) {
      console.log(error);
      throw new ServiceUnavailableException('Error sending email');
    }
  }
  // for jwt strategy
  async validateUserById(userId: number): Promise<User> {
    return this.userRepository.findOneBy({ id: userId });
  }
}
