class LoginMeta {
  // Sign In type
  // 1 : Facebook
  // 2 : LinkedIn
  static LOGIN_TYPE_FB = '1';
  static LOGIN_TYPE_LI = '2';

  // Meta data for LinkedIn Sign In
  static redirectUrl = 'http://localhost';
  static clientId = '78831o5pn1vg4p';
  static clientSecret = 'ioMEK1Qu77xqxKyu';
  static state = 'DCEeFWf45A53qdfKef424';
  static scopes = ['r_basicprofile', 'r_emailaddress', 'rw_company_admin'];
}

module.exports = LoginMeta;