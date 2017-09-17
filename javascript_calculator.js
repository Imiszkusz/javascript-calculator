
const CIRCLES = document.getElementsByClassName('circles');
const MAIN_OUTPUT = document.querySelector('.final-result');
const SECONDARY_OUTPUT = document.querySelector('.memory-input');
const INPUT_WRAPPER = document.querySelector('.input-wrapper');

const OPERATORS = ['+', '-', 'x', '÷'];


var input = [];


createCircles(CIRCLES);
initializeBtns();



/*
1. Megnézi, hogy az utolsó három karakter vmelyike zárójel-e "(" ? 
2. Ha igen, megkeresi a bezáró ")" felét.
3. Megnézi, hogy azon belül van-e másik zárójel - addig folytatja, amíg nem talál több zárójelet,
vagyis tiszta a matematikai művelet.
4. Elvégzi a műveletet
5. A két zárójelet kitörli
6. Ha van még zárójelen belül művelet, akkor azokat végzi el, ha nincs, akkor megy sorban


OK, megpróbáljuk végigvárni az egész inputot, az egész tömböt beadni a calc függvénynek, és úgy megoldani
mert a zárójelek miatt nem lehet szarakodni a switch-el.
Rá kell keresni a zárójeles kifejezésekre és sorban megoldani a műveleteket.
DE így szükségem van az előjel +/- gombra is, ami ugye nincs még meg.
Szóval először zárójel nélkül csináljuk - ami eleve a feladat is volt.

Writing operator * / precedence over +-

*/



//***************************************************************************************************

function createCircles(DOMElements){

	DOMElements[0].style.width = '.5rem';
	DOMElements[0].style.height = '.5rem';
	DOMElements[0].style['background-color'] = 'white';
	DOMElements[0].style['border-radius'] = '50%';

	var regexp = /^[0-9]*[\.\d]*/

	for(var i = 1; i < DOMElements.length; i++){

	    DOMElements[i].style['background-color'] = 'white';
	    DOMElements[i].style['border-radius'] = '50%';

	    console.log(DOMElements[i-1].style.width.match(regexp));
	    

		if(i <= 3){
		  let number = Number(DOMElements[i-1].style.width.match(regexp));
		  DOMElements[i].style.width = number + 0.75 + 'rem';
		  DOMElements[i].style.height = DOMElements[i].style.width;
		}

		else {
		  let number = Number(DOMElements[i-1].style.width.match(regexp));
		  DOMElements[i].style.width = number - 0.75 + 'rem';
		  DOMElements[i].style.height = DOMElements[i].style.width;
		}
	}
}



function isFloating(num){

	if(num.match(/\./)) return true
	else return false;
}



function calcResult(exp){

	var mapObj = {
		'+': function add(x, y){ return Number(x) + Number(y)},
		'-': function subtract(x, y){ return Number(x) - Number(y)},
		'x': function multiply(x, y){ return x * y},
		'÷': function divide(x, y){ return x / y}
	}

	for(var i in mapObj){
		if(i == exp[1]){
		  return mapObj[i](exp[0], exp[2]);
		}
	}
}


function updateAndCalc(exp, inputarr, newinput){


	//console.log('Expression is: ', exp);

	if(newinput == '='){
	  console.log('Expression is: ', exp);
	  console.log('Inputarr is: ', inputarr);
	  MAIN_OUTPUT.textContent = calcResult(exp);
	  inputarr.push(newinput);
	  inputarr.push(calcResult(exp));
	  SECONDARY_OUTPUT.textContent = inputarr.join('');
	}

	

	else {
	  inputarr.push(newinput);
	  console.log('Expression is: ', exp);
	  MAIN_OUTPUT.textContent = calcResult(exp);
	  exp = [MAIN_OUTPUT.textContent];
	  SECONDARY_OUTPUT.textContent = inputarr.join('');

	  return exp;
	}
}


function updateWithoutCalc(lastinp, inputarr){

	lastinp = inputarr[inputarr.length - 1];
	MAIN_OUTPUT.textContent = lastinp;
	SECONDARY_OUTPUT.textContent = input.join('');
}



function initializeBtns(){

	var tmpExpression = [];
	var tmpArray = [];

	INPUT_WRAPPER.addEventListener('click', function inputHandler(e){

		var lastInputVal = input[input.length - 1];

		if(e.target.classList.contains('btn')){

			console.log('isNaN?: ' + Number.isNaN(Number(e.target.textContent)))

			if(e.target.textContent == 'AC'){
				input = [];
				tmpExpression = [];
				lastInputVal = input[input.length - 1];
				MAIN_OUTPUT.textContent = '0';
				SECONDARY_OUTPUT.textContent = '0';
			}
			
			//If the button hit is this CE button and there's not yet a '=' sign in the input (it's
			// not finished yet)
			else if(e.target.textContent == 'CE' && input[length - 2 != '=']){
				input.pop();
				lastInputVal = input[input.length - 1];

				if(input.length === 0){
			      MAIN_OUTPUT.textContent = '0';
				  SECONDARY_OUTPUT.textContent = '0';
				}
				else{
				  MAIN_OUTPUT.textContent = tmpExpression;
				  SECONDARY_OUTPUT.textContent = input.join('');
				}
				
			}

			else {

				

				switch(true){
					// ha az input tömb hossza legalább 3, az utolsó input nem = és nem műveleti jel, 
					// és leütött gomb =,  fontos a CE miatt!!!
					case input.length >= 3 && input[length - 1] != '=' && !(OPERATORS.includes(input[length - 1])) && e.target.textContent == '=':

					  if(input.length == 3) tmpExpression = tmpExpression.concat(input.slice(-3));
					  else tmpExpression = tmpExpression.concat(input.slice(-2));
					  updateAndCalc(tmpExpression, input, e.target.textContent);
					  tmpExpression = [];
					  input = [];
					  lastInputVal = input[input.length - 1];
					  break;


					// ha az input tömb hossza legalább 3 és a lenyomott gomb +-*/ 
					case input.length >= 3 && OPERATORS.includes(e.target.textContent):
					  if(tmpExpression.length === 0){
					      tmpExpression = input.slice(-3);
					      tmpExpression = updateAndCalc(tmpExpression, input, e.target.textContent);
					  }

					  else {
					  	tmpExpression = tmpExpression.concat(input.slice(-2));
					  	tmpExpression = updateAndCalc(tmpExpression, input, e.target.textContent);

					  }
					  break;

					//If there's no input yet and the button hit is a number, but not 0
					case input.length == 0 && !(Number.isNaN(Number(e.target.textContent)) && e.target.textContent != '0'):
					  input.push(e.target.textContent);
					  updateWithoutCalc(lastInputVal, input)
					  break;

					// If there's some input already, the last input value is a math operator and the button hit is a number, but not a decimal dot
					case input.length > 0 && OPERATORS.includes(lastInputVal) && !(Number.isNaN(Number(e.target.textContent)) && e.target.textContent != '.'):
					  input.push(e.target.textContent);
					  updateWithoutCalc(lastInputVal, input)
					  break;

					// If there's some input already, the last input value is an integer and the button his is a decimal dot
					case input.length > 0 && !(Number.isNaN(Number(lastInputVal))) && !(isFloating(lastInputVal)) && e.target.textContent == '.':
					  input[input.length - 1] += e.target.textContent;
					  updateWithoutCalc(lastInputVal, input)
					  break;

					// If there's some input already, the last inpuzt value is a number and the button hit is a number too
					case input.length > 0 && !(Number.isNaN(Number(lastInputVal))) && !(Number.isNaN(Number(e.target.textContent))):
					  input[input.length - 1] += e.target.textContent;
					  updateWithoutCalc(lastInputVal, input)
					  break;

					// If there's some input already and the button hit is a math operator
					case input.length > 0 && OPERATORS.includes(e.target.textContent):
					  input.push(e.target.textContent);
					  updateWithoutCalc(lastInputVal, input)
					  break;
				}
				console.log(input, lastInputVal);

			}
		}
	})
}


