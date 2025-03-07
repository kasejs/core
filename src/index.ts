// Test type checking
const print = (msg: string) => {
  console.log(msg);
};

// Test top level await
await (async () => {
  print("We are meant to do great things");
})();
