const smallScreen = document.querySelector(".intermediate");
const mainScreen = document.querySelector(".result");
const opSign = document.querySelector(".operator");
const sign = document.querySelector(".sign");

const digits = document.querySelectorAll(".digit");
const functions = document.querySelectorAll(".function");
const operations = document.querySelectorAll(".operation");

let number1 = "";
let number2 = "";
let operator;


const operate = (operator, number1, number2=0 ) => {
  switch (operator) {
    case "+": return number1 + number2;
    case "-": return number1 - number2;
    case "*": return number1 * number2;
    case "/": 
      if( number2 === 0) return " 💣 😱 🤯 💔 🪦 ";  
      return number1 / number2;
    case "%": return parseFloat(number1 / 100);
    case "±": return ;
    default: break;

  }
}




digits.forEach( (digit) => {
  digit.addEventListener("click", (e) => {
    if(number1.length >= 12) return;
    console.log("key", e.target.textContent);
    number1 += e.target.textContent;
    mainScreen.textContent = number1;
  })
})


functions.forEach( (functn) => {
  functn.addEventListener("click", (e) => {
    console.log("key", e.target.textContent );
    switch(e.target.textContent) {
      case "AC":
        mainScreen.textContent = "0";
        opSign.textContent = "";
        number1 = "";
        number2 = "";
        operator = "";
        break;
      case "C" :
        number1 = "";
        mainScreen.textContent = "0";
        break;
      case "⌦" :
        number1 = number1.slice(0, -1);
        mainScreen.textContent = number1;
        if(number1 == "") mainScreen.textContent = "0";
      default: break;
    } 
  })
});


operations.forEach( (op) => {
  op.addEventListener("click", (e) => {
    console.log("Op: ", e.target.textContent);
    operator = e.target.textContent;
    opSign.textContent = operator;

    if( operator === "±") {
      opSign.textContent = "";
      if(number1 == "0") {
        number1 = "-0";
      }else {
        number1 = number1 * -1;
      }
      
      mainScreen.textContent = number1;
    }
  })
})

