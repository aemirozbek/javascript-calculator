import { useState } from "react";

function App() {
  const numbers = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  function multiply(x, y) {
    return x * y;
  }
  function divide(x, y) {
    return x / y;
  }
  function add(x, y) {
    return x + y;
  }
  function subtract(x, y) {
    return x - y;
  }
  const [result, setResult] = useState();
  const [total, setTotal] = useState([]);

  

  function handleInput(input) {
    if (/[0-9.]/.test(input)) {
      // If the input is a number, add it to the current subarray
      if(!result=="" && !/[+\-x/]/.test(total[total.length-1])){ 
        setTotal([])
        setResult("")
      }
      
      setTotal(prevArray => {
        if (
          prevArray.length === 0 ||
          /[+\-x/]/.test(prevArray[prevArray.length - 1])
        ) {
          if(input==="."){
            return [...prevArray, ["0."]];
          }
          return [...prevArray, [input]]; //initialize the subarray
        } else {
          const lastSubarray = prevArray[prevArray.length - 1];
          if(input==="." && (lastSubarray.includes(".") || lastSubarray.includes("0."))){
            return prevArray
          }
          return [...prevArray.slice(0, -1), [...lastSubarray, input]]; //remove the last subarray and replace it with the same subarray with the latest input
        }
      });
    } else { // below here operators are handled
      if(/[+\-x/]/.test(input)){
        if(!result==""){ //if operand is used on the result its set to the total value back again
          setTotal([result])
          setResult("")
        }
        // If the input is an operator, add it as a string to the main array
        setTotal(prevArray => {
          if (prevArray.length === 0) {
            return [...prevArray, [0], input]
          } else if(input==="-" && !/[+\-x/.]/.test(prevArray[prevArray.length-2])) {
            return [...prevArray, input]
          } else if(/[+\-x/]/.test(input) && !/[+\-x/]/.test(prevArray[prevArray.length-1])) {
            return [...prevArray, input]
          } else return prevArray
        });
      }
      
    }
  }

  function handleEquals() {
    const operatorArray = [multiply, divide, add, subtract]
    const operatorSymbols = ["x", "/", "+", "-"]
      let newTotal = [...total];
    if(/[+\-x/]/.test(newTotal[newTotal.length-1])) {
      setTotal(prevArray => [...prevArray.slice(0, -1)])
      newTotal.pop()
    }
    for(let j = 0; j<operatorArray.length; j++) {

    while (newTotal.includes(operatorSymbols[j])) {
      console.log("there is a " +operatorSymbols[j])
      let i = newTotal.indexOf(operatorSymbols[j]);
      const num1 = Number(newTotal[i - 1].join(""));
      const num2 = Number(newTotal[i + 1].join(""));
      newTotal.splice(i - 1, 3, [operatorArray[j](num1, num2)]);
      console.log("hi"+operatorArray[j](num1, num2))
      setResult(newTotal);
    }
    }
  }
  console.log(total);




  return (
    <div>
      <button id="clear" onClick={() => {setTotal([]);setResult("")}}>
        AC
      </button>
      {numbers.map((e, index) => (
        <button id={e} key={e} onClick={() => handleInput(index)}>
          {index}
        </button>
      ))}
      <button id="add" onClick={() => handleInput("+")}>
        +
      </button>
      <button id="subtract" onClick={() => handleInput("-")}>
        -
      </button>
      <button id="multiply" onClick={() => handleInput("x")}>
        x
      </button>
      <button id="divide" onClick={() => handleInput("/")}>
        /
      </button>
      <button id="decimal" onClick={() => handleInput(".")}>
        .
      </button>
      <button id="equals" onClick={handleEquals}>
        =
      </button>
      <div id="display">{total}</div>
      <div id="result">{result}</div>
    </div>
  );
}

export default App;
