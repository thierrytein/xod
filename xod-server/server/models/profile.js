const methods = require('../utils/methods');

module.exports = function ProfileModel(Profile) {
  methods.filter(
    [
      'findById',

      'login',
      'logout',
      'resetPassword',
      'confirm',

      '__findById__projects',
      '__get__projects',
      '__count__projects',
    ],
    Profile
  );
};