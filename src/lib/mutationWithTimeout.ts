/**
 * Wraps an async function with a timeout. If the function doesn't resolve
 * within `ms` milliseconds, the promise rejects with a timeout error.
 */
export function withTimeout<T>(fn: () => Promise<T>, ms = 30000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("La operación tardó demasiado. Intenta de nuevo.")),
      ms
    );
    fn()
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
