// Small helper to wrap async express handlers so errors propagate to next(err)
export default function wrapAsync(fn) {
  return function (req, res, next) {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
}
