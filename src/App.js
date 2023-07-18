import { useState } from "react";

function App() {
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
      if(total.length>0 && total[total.length - 1].length>21 && total[total.length-1]!=="DIGIT LIMIT MET") {
        const preservedTotal = total;
        setTotal([...preservedTotal, "DIGIT LIMIT MET"])
        setTimeout(() => {
          setTotal(preservedTotal)
        }, 1000);
        return
      }
      if(total[total.length-1]==="DIGIT LIMIT MET") {
        return
      }
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
    <div id="container">
      <div id="calculator">
  <div id="formula">{total[total.length-1] !== "DIGIT LIMIT MET" ? total : total.splice(0, total.length-1)}</div>
  <div id="display">{total.length === 0 ? [0] : total[total.length - 1]}</div>
  <div id="buttons">
      <button id="clear" onClick={() => { if(total[total.length-1]!=="DIGIT LIMIT MET"){setTotal([]); setResult("");} }}>
        AC
      </button>
      <button id="divide" className="operator" onClick={() => handleInput("/")}>
        /
      </button>
      <button id="multiply" className="operator" onClick={() => handleInput("x")}>
        x
      </button>
      <button id="seven" onClick={() => handleInput(7)}>7</button>
      <button id="eight" onClick={() => handleInput(8)}>8</button>
      <button id="nine" onClick={() => handleInput(9)}>9</button>
      <button id="subtract" className="operator" onClick={() => handleInput("-")}>
        -
      </button>
      <button id="four" onClick={() => handleInput(4)}>4</button>
      <button id="five" onClick={() => handleInput(5)}>5</button>
      <button id="six" onClick={() => handleInput(6)}>6</button>
      <button id="add" className="operator" onClick={() => handleInput("+")}>
        +
      </button>
      <button id="one" onClick={() => handleInput(1)}>1</button>
      <button id="two" onClick={() => handleInput(2)}>2</button>
      <button id="three" onClick={() => handleInput(3)}>3</button>
      <button id="equals" onClick={handleEquals}>
        =
      </button>
      <button id="zero" onClick={() => handleInput(0)}>0</button>
      <button id="decimal" onClick={() => handleInput(".")}>
        .
      </button>
  </div>
</div>
    </div>
  );
}

export default App;
