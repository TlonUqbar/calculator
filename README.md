# Calculator

Requirements:
- [x] All of the basic math operators you typically find on simple calculators.
	- [x] Add
	- [x] Subtract
	- [x] Multiply
	- [x] Divide
  - [x] Percent
- [x] An operation consists of a number, an operator and another number.
	- [x] Create a variable for the first number
	- [x] Create a variable for the second number
	- [x] Create a variable for your operator
	- [ ] Use the variables to update your display
- [x] Create a function `operate` that take a and operator and 2 numbers and then calls one of the above functions on the numbers
- [x] Create basic HTML calculator with buttons for each digit, each function and the "Equals" key
- [x] There should be a display for the calculator.
- [x] Add a "Clear" button.
- [ ] Create the functions that populate the display when you click the number buttons.
	- [ ] You should be storing the display value in a variable somewhere for use in the next step
- [ ] Make the calculator work
	- [ ] Store first and second number inputs into the calculator
	- [ ] Utilize the operator that the user selects and then `operate()` on the two numbers when the user presses the ` = `  key
	- [ ] Update display with the solution from `operate()`


Gotchas:
- [ ] Users should be able to string together several operations and get the right answer, with each pair of numbers being evaluated at a time.
	- [ ] Example: `12 + 7 - 5 * 3 = ` should yield ` 42 `   
	- [ ] An example of the behavior we are looking for would be 	
- [ ] Your  calculator should not evaluate more than a single pair of numbers at a time.
	- [ ] Example:  number `12`  operator ` + ` second number and then second operator ` - ` 
	- [ ] The calculator should do this:  
		- [ ] First evaluate the first pair of numbers ` 12 + 7 `.  
		- [ ] Second display result of calculation ` 19 ` .  
		- [ ] Finally use that result ` 19 ` as the first number for next calculation, along with operator ` - `.
 - [ ] You should round answers with long decimals so that they don't overflow the screen.
 - [ ] Pressing ` = ` before entering all the numbers or an operator could cause problems
 - [ ] Pressing "clear" should wipe out any existing data.  
	 - [ ] Make sure the user is really starting fresh after pressing "clear"	 
- [ ] Display a snarky error message if the user tried to divide by 0
	- [ ] And don't let it crash the calculator

Extra Credit:
- [ ] Add floating point numbers, by adding a  ` . `  button and let users input decimals.
	- [ ] Make sure you don't let the users type more than one ` . `.
	- [ ] Disable the ` . ` if there is one already in the display
- [ ] Make it look nice.  Practice your CSS skill.
	- [ ] At least make the Operation buttons a different color.
- [ ] Add a "backspace" button, so the user can undo if they click the wrong number.
- [ ] Add keyboard support! 
