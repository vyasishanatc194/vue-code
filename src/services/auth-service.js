import Service from './api-service';
import getErrorMessage from '@/utils/getErrorMessage';

const requestPasswordResetEndpoint = 'auth/reset_password/request';
const checkTokenEndpoint = 'auth/reset_password/validate_token';
const completePasswordResetEndpoint = 'auth/reset_password/complete';

const requestPasswordReset = async function(email_address) {
  try {
    await Service.post(`${requestPasswordResetEndpoint}`, { email_address });
    return { success: true, message: 'Request sent. Please check your mail and follow the instructions there.' };
  } catch(error) {
    let errorData = getErrorMessage(error);
    return { success: false, message: errorData.message, errors: errorData.errors };
  }
}

const checkToken = async function(token) {
  try {
    await Service.post(`${checkTokenEndpoint}`, { token });
    return { success: true };
  } catch (error) {
    let errorData = getErrorMessage(error);
    return { success: false, message: errorData.message, errors: errorData.errors };
  }
};

const completePasswordReset = async function(password, token) {
  try {
    await Service.post(`${completePasswordResetEndpoint}`, { password, token });
    return { success: true, message: 'Password changed successfully.' };
  } catch (error) {
    let errorData = getErrorMessage(error);
    return { success: false, message: errorData.message, errors: errorData.errors };
  }
};

export {
  requestPasswordReset,
  checkToken,
  completePasswordReset,
};
