import { IsNotEmpty, IsEmail, Matches, Length } from 'class-validator';
import { MESSAGES, REGEX } from 'src/app.utility';

export class CreateUserDto {
  email: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Length(8, 24)
  @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MSG })
  password: string;

  // @IsNotEmpty()
  // @Length(8, 24)
  // @Matches(REGEX.PASSWORD_RULE, { message: MESSAGES.PASSWORD_RULE_MSG })
  // confirm: string;
}
