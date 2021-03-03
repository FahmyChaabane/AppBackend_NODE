const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("promise 1 pending...");
    //resolve(1);
    reject(new Error("error..."));
  }, 4000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("promise 2 pending...");
    resolve(2);
    reject(new Error("error..."));
  }, 3000);
});

Promise.all([p1, p2])
  .then((result) => console.log("result of all ", result))
  .catch((err) => console.log(err));
Promise.race([p1, p2]).then((result) => console.log("result of race ", result));

Promise.resolve(3).then((n) => console.log("result resolve ", n));
Promise.reject(new Error("reason..")).catch((err) =>
  console.log("result reject ", err.message)
);
