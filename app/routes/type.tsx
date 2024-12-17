// generic function
function print<T>(arg: T): T {
  console.log({ arg });
  return arg;
}

// Test cases
let var1 = print<number>(10);
let var2 = print<string>("hello");
let var3 = print<boolean>(true);
