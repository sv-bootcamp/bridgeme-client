import ErrorMeta from './ErrorMeta';

class ErrorUtil {
  static getErrorMsg(errCode) {
    let result = { code: errCode };

    if (errCode === ErrorMeta.ERR_NONE) {
      result.msg = '';
    } else if (errCode === ErrorMeta.ERR_TOKEN_INVALID) {
      result.msg = 'Token has been expired. Try again';
    } else if (errCode === ErrorMeta.ERR_NO_LOGIN_TYPE) {
      result.msg = 'Login again';
    } else if (errCode === ErrorMeta.ERR_SERVER_FAIL) {
      result.msg = 'Server error. Try again';
    } else if (errCode === ErrorMeta.ERR_FB_LOGIN) {
      result.msg = 'Login error from facebook';
    } else if (errCode === ErrorMeta.ERR_NO_USER_DATA) {
      result.msg = 'Cannot fetch user data';
    } else if (errCode === ErrorMeta.ERR_APP_FAIL) {
      result.msg = 'Error has occured from web';
    }

    return result;
  }
}

module.exports = ErrorUtil;
