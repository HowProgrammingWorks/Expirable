'use strict';

const PROMISE_TIMEOUT = 1000;

const expirable = (executor, timeout = PROMISE_TIMEOUT) =>
  new Promise((resolve, reject) => {
    let expired = false;
    let timer = null;
    executor(val => {
      if (expired) return;
      clearTimeout(timer);
      resolve(val);
    }, err => {
      if (expired) return;
      clearTimeout(timer);
      reject(err);
    });
    timer = setTimeout(() => {
      expired = true;
      reject(new Error("Expired"));
    }, timeout);
  });

// Usage

expirable(resolve => {
  setTimeout(() => {
    resolve('Resolved before timeout');
  }, 100);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});

expirable((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Something went wrong'));
  }, 100);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});

expirable(resolve => {
  setTimeout(() => {
    resolve('Never resolved before timeout');
  }, 2000);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});

expirable((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('Never rejected before timeout'));
  }, 2000);
}).then(data => {
  console.dir({ data });
}).catch(error => {
  console.dir({ error: error.message });
});
