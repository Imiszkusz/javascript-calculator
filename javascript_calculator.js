const circles = document.getElementsByClassName('circles');


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


createCircles(circles);