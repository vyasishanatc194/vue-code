function calculateBaseUrl() {
  var h = window.location.host.toLowerCase();
  var colonidx = h.indexOf(':');
  if (colonidx >= 0) h = h.substring(0, colonidx);
  return window.location.protocol + '//' + window.location.host;
}

export default { calculateBaseUrl };
