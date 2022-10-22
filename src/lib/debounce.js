const debounce = (callback, delay) => {
  clearTimeout(callback._tId);
  callback._tId = setTimeout(function () {
    callback();
  }, delay);
};

export default debounce;
