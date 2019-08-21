'use strict';

const PROMISE_TIMEOUT = 1000;

class Expirable {
  constructor(executor, timeout = PROMISE_TIMEOUT) {
    this.expired = false;
    this.timer = null;
    this.promise = new Promise((resolve, reject) => {
      const exit = fn => val => {
        if (this.expired) return;
        clearTimeout(this.timer);
        fn(val);
      };
      executor(exit(resolve), exit(reject));
      this.timer = setTimeout(() => {
        this.expired = true;
        reject(new Error('Expired'));
      }, timeout);
    });
    return this.promise;
  }
}

// Usage

new Expirable(resolve => {
  setTimeout(() => {
    resolve('Resolved before timeout');
  }, 100);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});

new Expirable((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Something went wrong'));
  }, 100);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});

new Expirable(resolve => {
  setTimeout(() => {
    resolve('Never resolved before timeout');
  }, 2000);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});

new Expirable((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Never rejected before timeout'));
  }, 2000);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});
