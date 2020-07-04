import { extend, configure, setInteractionMode } from 'vee-validate';
import { required, email, min, max, digits, min_value, alpha, alpha_spaces, alpha_dash, confirmed } from 'vee-validate/dist/rules';

configure({
  classes: {
    valid: '',
    invalid: 'is-invalid',
  },
});

extend('required', {
  ...required,
  message: 'This field is required',
});

extend('min', {
  ...min,
  message: 'This field should be at least {length} characters in length.',
});

extend('max', {
  ...max,
  message: 'This field may not be greater than {length} characters in length.',
});

extend('email', {
  ...email,
  message: 'Please enter a valid email address.',
});

extend('digits', {
  ...digits,
  message: 'Please enter only digits.'
});

extend('min_value', {
  ...min_value,
  message: 'Please enter a valid number.'
});

extend('phone', {
  validate: str => {
    var pattern = new RegExp('^[+]*[0-9-]*$', 'i'); // fragment locator
    return !!pattern.test(str);
  },
  message: 'This is not a valid phone number.',
});

extend('alpha', {
  ...alpha,
  message: 'This field may only contain alphabetic characters'
});

extend('alpha_spaces', {
  ...alpha_spaces,
  message: 'This field may only contain alphabetic characters as well as spaces'
});

extend('alpha_dash', {
  ...alpha_dash,
  message: 'This field may only contain alpha-numeric characters as well as dashes and underscores'
});

extend('alpha_dash_space', (value) => {
  const alpha_dash_space = new RegExp('^([A-Za-z0-9-_ ])+$');
  return alpha_dash_space.test(value) || 'This field may only contain alpha-numeric characters as well as dashes, underscores and spaces';
});

extend('confirmed', {
  ...confirmed,
  message: 'Passwords don\'t match.'
});

extend('url', (value) => {
  const url = new RegExp('^http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*(),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+$');
  return url.test(value) || 'The url format is invalid.';
});

extend('matchField', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Notification Email does not match'
});


/*
* http://vee-validate.logaretm.com/v2/guide/interaction.html#custom-modes
*/

setInteractionMode('debouncedAggressive', () => {
  return {
    on: ['input'],
    debounce: 667
  };
})