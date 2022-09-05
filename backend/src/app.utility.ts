import { HttpStatus, ValidationPipe } from '@nestjs/common';

const PASSWORD_RULE =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*]).{8,24}$/;

const PASSWORD_RULE_MSG =
  'Password should have 1 upcase, lowcase, number, special character.';

const VALIDATION_PIPE = new ValidationPipe({
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const REGEX = {
  PASSWORD_RULE,
};

export const MESSAGES = {
  PASSWORD_RULE_MSG,
};

export const SETTINGS = {
  VALIDATION_PIPE,
};
