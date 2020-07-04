const getErrorMessage = (error) => {
  let message = '';
  let errors = {};
  if (error.response) {
    message = ((error.response || {}).data || {}).message || 'Error';
    errors = (error.response.data || {}).errors || {};
  } else if (error.request) {
    message =
      'No response received from the server. If the problem persists contact the site administrator (' + error.message + ')';
  } else {
    message = error.message;
  }
  
  return { message, errors };
}

export default getErrorMessage;
