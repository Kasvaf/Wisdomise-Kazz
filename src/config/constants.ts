export const VERSION = 'v1.0';
export const WISDOMISE_TOKEN_KEY = 'WISDOMISE_TOKEN_KEY';
export const REFERRAL_LEVELS = 'REFERRAL_LEVELS';
export const WISDOMISE_EMAIL_KEY = 'WISDOMISE_EMAIL_KEY';
export const CHARACTER_NUMBER_REG_EXPRESSION = /^[a-z0-9]+$/i;
export const PASSWORD_REGULAR_EXPRESSION =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;

export const EMAIL_REG_EXPRESSION =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const PASSWORD_RULES_CONTENT = {
  invalid:
    'Password must be at least 8 characters with 1 lower case letter, 1 upper case letter and 1 number.',
};

export const CAPTCHA_ERRORS = {
  invalid: 'Failed to verify captcha, please try again.',
};

export const AUTH_ERRORS = {
  signUp: {
    fullName: {
      required: 'Please fill Full Name',
      invalid: 'Please only use English characters for Full Name',
    },
    email: {
      required: 'Please fill email',
      invalid: 'Please provide a valid email address',
    },
    password: {
      required: 'Please fill password',
      invalid: PASSWORD_RULES_CONTENT.invalid,
    },
    confirmPassword: {
      invalid: 'Password confirmation was incorrect',
    },
    referralCode: {
      invalid:
        'Referral code should be a 8 characters consist of English characters and numbers',
      notExists: 'Referral code is invalid',
    },
    privacyPolicy: {
      required: 'Please read and check privacy policy',
    },
    terms: {
      required: 'Please read and check the terms',
    },
    captcha: CAPTCHA_ERRORS,
  },
  signIn: {
    email: {
      required: 'Please fill email',
      invalid: 'Please provide a valid email address',
    },
    password: {
      required: 'Please fill password',
      invalid: 'Password must be at least 8 characters',
    },
    captcha: CAPTCHA_ERRORS,
  },
  forgotPasswordSubmit: {
    confirmPassword: {
      invalid: 'Passwords does not match',
    },
    password: {
      required: 'Please fill password',
      invalid: PASSWORD_RULES_CONTENT.invalid,
    },
    captcha: {
      invalid: 'Failed to verify captcha please try again.',
    },
  },
  settingErrors: {
    fullName: {
      required: 'Please fill Full Name',
      invalid: 'Please only use English characters for Full Name',
    },
    oldPassword: {
      required: 'Please fill old password',
      invalid: 'Old Password must be at least 8 characters',
    },
    password: {
      required: 'Please fill new password',
      invalid: PASSWORD_RULES_CONTENT.invalid,
    },
    confirmPassword: {
      invalid: 'Password confirmation was incorrect',
    },
  },
};

export const ANALYTICS_ERRORS = {
  aat: {
    dateRange: {
      invalid: 'Start date must be greater than end date',
    },
  },
  spo: {
    dateRange: {
      invalid: 'Start date must be greater than end date',
    },
  },
};
