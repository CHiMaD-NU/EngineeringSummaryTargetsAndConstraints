
//this function will use the answers to create a grid of boxes and highlight the correct values
//in hindsight, this might have been better as an svg with rects...
function populateBoxes(){

	//add the row labels
	var dv = d3.select('#labels').select('.boxContainer').selectAll('.rowTitle')
		.data(params.answers.columns).enter()
		.filter(function(d) { return !d.includes('Timestamp') })
			.append('div')
				.attr('class', 'rowTitle')
				.attr('id', function(d,j){return params.cleanString(d);})
				.text(function(d,j){
					return d.replace('Classification [','').replace(']','');
				})

				

	//create the grid of boxes (using html divs), and label the answers
	params.columns.forEach(function(c,j){
		var dv = d3.select('#'+params.cleanString(c)).select('.boxContainer').selectAll('.box')
			.data(params.answers.columns).enter()
			.filter(function(d) { return !d.includes('Timestamp') })
				.append('div')
					.attr('class', function(d,j){return 'box '+params.cleanString(c)})
					.attr('id', function(d,j){return params.cleanString(c)+params.cleanString(d);})
					.style('border-width',function(d,j){
						if (c.toLowerCase().includes(params.answers[0][d].toLowerCase())) {
							return 4
						}
						return 1
					})
					.style('line-height',function(d,j){
						if (c.toLowerCase().includes(params.answers[0][d].toLowerCase())) {
							return '1.5vw'
						}
						return '2vw'
					})
					.attr('data-answer',function(d,j){
						if (c.toLowerCase().includes(params.answers[0][d].toLowerCase())) {
							return 'true'
						}
						return 'false'
					})
				
	})

	//center the boxes on the page
	// var wl = d3.select('#labels').node().getBoundingClientRect().width
	// var w = 0
	// params.columns.forEach(function(c,j){
	// 	w += d3.select('#'+c.toLowerCase()).select('.boxContainer').select('.box').node().getBoundingClientRect().width;
	// })
	// d3.select('#container').style('margin-left',(window.innerWidth-w)/2. - wl)
	resizer();
}

//count the uniq elements in an array and return both the counts and the unique array
function countUniq(arr){
	out = {'uniq':[], 'num':{}};

	arr.forEach(function(a,i){
		ac = params.cleanString(a);
		if (!out.uniq.includes(ac)){
			out.uniq.push(ac);
			out.num[ac] = 1;
		} else {
			out.num[ac] += 1;
		}
	})

	return out;
}

function colorBoxes(){
	console.log(params.responses)
	//count up all the responses
	params.responses.columns.forEach(function(rc,i){
		if (!rc.includes('Timestamp')){
			vals = []
			params.responses.forEach(function(r,j){
				//get the column
				vals.push(r[rc])
				if (j == params.responses.length-1){
					uVals = countUniq(vals);
					params.columns.forEach(function(c,k){
						id = params.cleanString(c)+params.cleanString(rc)
						var pct = 0;
						if (uVals.num[params.cleanString(c)]){
							pct = uVals.num[params.cleanString(c)]/params.responses.length;

						}
						d3.select('#'+id)
							.style('background-color',params.colorMap(pct))
							.text(pct.toFixed(2))
							.attr('data-pct',pct)
						if (d3.select('#'+id).attr('data-answer') == 'true' & pct < params.pctLim){
							var cl = d3.select('#'+id).node().classList[1];
							var id2 = id.replace(cl,'');
							d3.select('#'+id2).classed('wrong',true)

						}
					})

				}
			})

		}
	})


}

