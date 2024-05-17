import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  IJwtPayload,
  ISignUpTokens,
  IUserPayload,
} from './interfaces/auth.interface';
import { GenericSqlRepository } from '../sql/generic-sql-repository';
import { throwApplicationError } from '../common/exception-instance';
import { saltRounds } from '../common/constants';
import { Result } from 'src/domain';

/**
 *Authentication service class
 *
 * @exports
 * @class AuthService
 * @implements {IAuthService}
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * method to generate access and refresh token
   *
   * @param {IUserPayload} payload
   * @returns {Promise<ISignUpTokens>}
   * @memberof AuthService
   */
  protected async generateAuthTokens(
    payload: IUserPayload,
  ): Promise<ISignUpTokens> {
    const { userId, email, role } = payload;
    const jwtPayload: IJwtPayload = {
      sub: userId,
      email,
      role,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(jwtPayload),
      this.signRefreshToken(jwtPayload),
    ]);

    return {
      refreshToken,
      accessToken,
    };
  }

  /**
   * method to sign access token
   *
   * @param {IJwtPayload} jwtPayload
   * @returns {Promise<string>}
   * @memberof AuthService
   */
  protected async signAccessToken(jwtPayload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      ),
    });
  }

  /**
   * method to sign refresh token
   *
   * @param {IJwtPayload} jwtPayload
   * @returns {Promise<string>}
   * @memberof AuthService
   */
  protected async signRefreshToken(jwtPayload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(jwtPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      ),
    });
  }

  /**
   * method to hash tokens
   *
   * @param {string} prop
   * @param {number} saltRound
   * @returns {Promise<string>}
   * @memberof AuthService
   */
  protected async hashData(prop: string, saltRound: number): Promise<string> {
    return bcrypt.hash(prop, saltRound);
  }

  /**
   * Generic method to update refresh token
   *
   * @param {GenericSqlRepository<any>} model
   * @param {UUID} userId
   * @param {string} refreshToken
   * @returns {Promise<{ accessToken: string }>}
   * @memberof AuthService
   */
  protected async updateRefreshToken(
    model: GenericSqlRepository<any, any>,
    userId: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const result: Result<any | null> = await model.findOne({
      where: { _id: userId },
    });

    if (result.isSuccess === false) {
      throwApplicationError(HttpStatus.FORBIDDEN, 'Access denied');
    }
    const userEntity = await result.getValue();
    const { refreshTokenHash, role, email } = userEntity;
    const verifyToken = await bcrypt.compare(refreshToken, refreshTokenHash);

    if (!verifyToken) {
      throwApplicationError(HttpStatus.FORBIDDEN, 'Access denied');
      this.nullifyRefreshToken(model, userId);
    }

    const payload = { userId, email, role };
    const newTokens = await this.generateAuthTokens(payload);
    const tokenHash = await this.hashData(newTokens.refreshToken, saltRounds);

    const domain = await model.findOne({ where: { _id: userId } });

    if (!domain) {
      throwApplicationError(HttpStatus.NOT_FOUND, 'Entity is not found');
    }

    domain.refreshTokenHash = tokenHash;

    await model.save(domain);

    return {
      accessToken: newTokens.accessToken,
    };
  }

  /**
   * method to log Out On Security Breach
   *
   * @param {GenericSqlRepository<any>} model
   * @param {UUID} userId
   * @returns {void}
   * @memberof AuthService
   */
  protected async nullifyRefreshToken(
    model: GenericSqlRepository<any, any>,
    userId: string,
  ): Promise<boolean> {
    let nullified = false;
    const result: Result<any> = await model.findOne({
      where: { _id: userId },
    });

    if (result) {
      const model = result.getValue();
      model.refreshTokenHash = null;
      await model.save(model);
      return (nullified = true);
    }
    return nullified;
  }

  /**
   * method to log Out On Security Breach
   *
   * @param {GenericSqlRepository<any>} model
   * @param {Types.ObjectId} userId
   * @returns {void}
   * @memberof AuthService
   */
  protected async logOut(
    model: GenericSqlRepository<any, any>,
    userId: string,
  ): Promise<boolean> {
    let loggedOut: boolean = false;
    const result: Result<any | null> = await model.findOne({
      where: { _id: userId },
    });

    if (result.isSuccess === false) {
      throwApplicationError(HttpStatus.NOT_FOUND, 'User does not exist');
    }
    const user = await result.getValue();

    if (
      result &&
      user.refreshTokenHash !== undefined &&
      user.refreshTokenHash !== null
    ) {
      const model = result.getValue();
      model.refreshTokenHash = null;
      await model.save(model);
      return (loggedOut = true);
    }
    return loggedOut;
  }
}
