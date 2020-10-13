function resizePara(lim, nLim){


	//resize the paragraph font size so the para fills the screen height
	var para = document.getElementById('paraColumn');
	var fs = parseFloat(window.getComputedStyle(para, null).getPropertyValue('font-size'));
	var rect = para.getBoundingClientRect();
	var height = window.innerHeight - rect.top;
	var diff = height - rect.height;
	var nTrial = 0;
	var fac = 0.5;

	while ((Math.abs(diff) > lim || diff < 0) & nTrial < nLim){
		var mult = fac*(1. + nTrial/nLim);
		if (diff > 0){
			mult =  2. - mult;
		}
		para.style.fontSize = fs*mult + 'px';
		fs = parseFloat(window.getComputedStyle(para, null).getPropertyValue('font-size'));
		rect = para.getBoundingClientRect();
		diff = height - rect.height;
		//console.log("para", nTrial, diff, fs, mult)
		nTrial += 1
	}	
}

function resizeBoxes(lim, nLim){

	var container = d3.select('#container').node();
	var boxContainer = d3.select('.boxContainer').node();
	var rect = container.getBoundingClientRect();
	var boxRect = boxContainer.getBoundingClientRect();
	var height = window.innerHeight - rect.top;
	//in case this is has a very tall aspect ratio (e.g. mobile on portrait layout)
	if (rect.height >= boxRect.height*2. & boxRect.height < height){
		height = boxRect.height;
	}

	var bw = parseFloat(d3.select('.box').style('width'));
	var bh = parseFloat(d3.select('.box').style('height'));

	var fsB = parseFloat(d3.select('.box').style('font-size'));
	var fsR = parseFloat(d3.select('.rowTitle').style('font-size'));
	var fsC = parseFloat(d3.select('.columnTitle').style('font-size'));

	var diff = height - rect.height;
	var nTrial = 0;
	var fac = 0.5;
	while ((Math.abs(diff) > lim || diff < 0) & nTrial < nLim){
		var mult = fac*(1. + nTrial/nLim);
		if (diff > 0){
			mult =  2. - mult;
		}

		d3.selectAll('.box')
			.style('width',bw*mult + 'px')
			.style('height',bh*mult + 'px')
			.style('font-size', fsB*mult + 'px')
			.style('line-height', function(d){
				if (d3.select(this).attr('data-answer') == 'true'){
					return fsB*mult + 'px';
				}
				return bh*mult + 'px';
			})
			.style('border-width', function(d){
				if (d3.select(this).attr('data-answer') == 'true'){
					return Math.max((bh*mult - fsB*mult)/2.,2) + 'px';
				}
				return '1px';
			})
		d3.selectAll('.columnTitle')
			.style('width',bw*mult + 'px')
			.style('font-size', fsC*mult + 'px')
		d3.selectAll('.rowTitle')
			.style('font-size', fsR*mult + 'px')
			.style('height', bh*mult + 'px')
			.style('line-height', bh*mult + 'px')
			.style('padding-top', (bh*mult - fsR*mult)*2. + 'px') //not sure I understand why I multiply by 2 (but it appears to work!)
		bw = parseFloat(d3.select('.box').style('width'));
		bh = parseFloat(d3.select('.box').style('height'));
		fsB = parseFloat(d3.select('.box').style('font-size'));
		fsR = parseFloat(d3.select('.rowTitle').style('font-size'));
		fsC = parseFloat(d3.select('.columnTitle').style('font-size'));
		rect = container.getBoundingClientRect();
		diff = height - rect.height;
		//console.log("box", nTrial, rect.height, boxRect.height, diff, bw, bh, fsB, fsR, fsC, mult)
		nTrial += 1
	}
	//console.log(height, diff)
}
function resizer(){
	var lim = 0.1*window.innerHeight; //pixel limit to allow
	var nLim = 50; //limit the number of iterations for text resizing

	//first resize the paragraph to fit the screen
	resizePara(lim, nLim);


	//now resize the boxes
	resizeBoxes(lim, nLim);

	//recenter the boxes
	// var wl = d3.select('#labels').node().getBoundingClientRect().width
	// var w = 0
	// params.columns.forEach(function(c,j){
	// 	w += d3.select('#'+c.toLowerCase()).select('.boxContainer').select('.box').node().getBoundingClientRect().width;
	// })
	// d3.select('#container').style('margin-left',(window.innerWidth-w)/2. - wl)
}