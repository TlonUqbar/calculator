let number1, number2, operator;


const operate = (operator, number1, number2=0 ) => {
  switch (operator) {
    case "+": return number1 + number2;
    case "-": return number1 - number2;
    case "*": return number1 * number2;
    case "/": 
      if( number2 === 0) return " 💣 😱 🤯 💔 🪦 ";  
      return number1 / number2;
    case "%": return parseFloat(number1 / 100);
    default: break;

  }
}







