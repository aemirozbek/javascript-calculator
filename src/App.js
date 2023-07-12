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
  const [total, setTotal] = useState([]);
  const [result, setResult] = useState();

  function handleInput(input) {
    if (/[0-9.]/.test(input)) {
      // below here numbers are handled
      if (!result == "" && !/[+\-x/]/.test(total[total.length - 1])) {
        // If the input is a number, add it to the current subarray
        setTotal([]);
        setResult("");
      }

      setTotal((prevArray) => {
        if (
          prevArray.length > 0 &&
          prevArray[prevArray.length - 1].length === 1 &&
          prevArray[prevArray.length - 1][0] === 0 &&
          input === 0
        ) {
          return prevArray;
        }
        if (
          prevArray.length === 0 ||
          /[+\-x/]/.test(prevArray[prevArray.length - 1])
        ) {
          if (input === ".") {
            return [...prevArray, ["0."]];
          }
          return [...prevArray, [input]]; //initialize the subarray
        } else {
          const lastSubarray = prevArray[prevArray.length - 1];
          if (
            input === "." &&
            (lastSubarray.includes(".") || lastSubarray.includes("0."))
          ) {
            return prevArray;
          }
          return [...prevArray.slice(0, -1), [...lastSubarray, input]]; //remove the last subarray and replace it with the same subarray with the latest input
        }
      });
    } else {
      // below here operators are handled
      if (/[+\-x/]/.test(input)) {
        if (!result == "") {
          //setting total value as the result to keep calculating with the new operator input
          setTotal(result);
          setResult("");
        }
        setTotal((prevArray) => {
          if (prevArray.length === 0) {
            return [...prevArray, [0], input];
          } else if (
            (input === "-" && /[0-9.]/.test(prevArray[prevArray.length - 2])) ||
            /[0-9.]/.test(prevArray[prevArray.length - 1])
          ) {
            return [...prevArray, input];
          } else if (
            /[+\-x/]/.test(prevArray[prevArray.length - 1]) &&
            /[+\-x/]/.test(prevArray[prevArray.length - 2])
          ) {
            return [...prevArray.slice(0, -2), input];
          } else if (
            /[+\-x/]/.test(prevArray[prevArray.length - 1]) &&
            input !== "-"
          ) {
            return [...prevArray.slice(0, -1), input];
          } else return prevArray;
        });
      }
    }
  }

  function handleEquals() {
    const operatorArray = [multiply, divide, subtract, add];
    const operatorSymbols = ["x", "/", "-", "+"];
    let newTotal = [...total];
    if (!result == "") {
      return;
    }
    if (
      /[+\-x/]/.test(newTotal[newTotal.length - 1]) &&
      /[+\-x/]/.test(newTotal[newTotal.length - 2])
    ) {
      // if the last two characters are operators
      setTotal((prevArray) => [...prevArray.slice(0, -2)]);
      newTotal.pop();
      newTotal.pop();
    } else if (/[+\-x/]/.test(newTotal[newTotal.length - 1])) {
      // if the last character is an operator
      setTotal((prevArray) => [...prevArray.slice(0, -1)]);
      newTotal.pop();
    }

    for (let i = 0; i < newTotal.length - 2; i++) {
      // if there is a subtraction after another operator in a calculation
      for (let j = 0; j < operatorSymbols.length; j++) {
        if (newTotal[i] === operatorSymbols[j]) {
          if (newTotal[i + 1] === "-") {
            newTotal.splice(i + 1, 1);
            newTotal[i + 1][0] *= -1;
            setResult(newTotal);
          }
        }
      }
    }

    if (!operatorSymbols.some((symbol) => newTotal.includes(symbol))) {
      // if newTotal doesn't include any operator
      setResult(newTotal);
      return;
    }
    for (let j = 0; j < operatorArray.length; j++) {
      while (newTotal.includes(operatorSymbols[j])) {
        let i = newTotal.indexOf(operatorSymbols[j]);
        const num1 = Number(newTotal[i - 1].join(""));
        const num2 = Number(newTotal[i + 1].join(""));
        newTotal.splice(i - 1, 3, [operatorArray[j](num1, num2)]);
        setResult(newTotal);
      }
    }
    setTotal((prevArray) => [...prevArray, " = ", ...newTotal]);
  }

  return (
    <div id="calculator">
      <button
        id="clear"
        onClick={() => {
          setTotal([]);
          setResult("");
        }}
      >
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
      <div id="formula">{total}</div>
      {total.length === 0 && <div id="display">{[0]}</div>}
      {total.length > 0 && <div id="display">{total[total.length - 1]}</div>}
    </div>
  );
}

export default App;
