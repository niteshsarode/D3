$(document).ready(function() {

	var margin = {top: 30, right: 50, bottom: 150, left: 150},
    width = 700 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    var margin1 = {top: 30, right: 50, bottom: 150, left: 150},
    width1 = 700 - margin1.left - margin1.right,
    height1 = 500 - margin1.top - margin1.bottom;

    // Define the div for the tooltip
	var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

	/**  Reading and Storing Data from csv file  **/
	

	d3.csv ("10yearAUSOpenMatches.csv", function (error, data ) {
		if (error) throw error;
      	//console.log(data); 

		var player1 = [];
		var player2 = [];
		var year = [];
       	for (var i = 0; i < data.length; i++) {
      		if (data[i].round == "Final") {
      			player1.push(data[i].player1);
      			player2.push(data[i].player2);
      			year.push(data[i].year);
      		} 

	    }

	    var dataPlayers = [];

		for (var i = 0; i < player1.length; i++ ) {
			dataPlayers.push({ 
				player1: player1[i],
				player2: player2[i],
				year: year[i]
	    	});
		}

		var avgFirstServe = {}
		var avgSecServe = {}
		data.forEach(function(d) {
			if (d.round == "Final") {
				avgFirstServe[d.year] = [d.avgFirstServe1, d.avgFirstServe2];
				avgSecServe[d.year] = [d.avgSecServe1, d.avgSecServe2];
			}
		});


	    /**  Scaling X and Y Axes for chart 1 **/
		var x = d3.scaleBand()
			.domain(player1)
			.rangeRound([0, width]);

		var y = d3.scaleBand()
			.domain(player2)
			.rangeRound([0, height]);

		var xAxis = d3.axisBottom(x).ticks(10);
		var yAxis = d3.axisLeft(y).ticks(10);


		


		/** SVG for chart 1**/
		var svg = d3.select("#svg1")
		    .attr("width", width + margin.left + margin.right)
		    .attr("height", height + margin.top + margin.bottom)
		  .append("g")
		    .attr("transform", 
		          "translate(" + margin.left + "," + margin.top + ")");

		

		/**  Plotting axes  **/
		svg.append("g")
		      .attr("class", "x axis")
		      .attr("transform", "translate(0," + height + ")")
		      .call(xAxis)
		    .selectAll("text")
		      .style("text-anchor", "end")
		      .attr("dx", "-.8em")
		      .attr("dy", "-.55em")
		      .attr("transform", "rotate(-90)" );

		svg.append("g")
		      .attr("class", "y axis")
		      .call(yAxis)
		    .append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 6)
		      .attr("dy", ".71em")
		      .style("text-anchor", "end");
		
		/** sAxes Labels **/	
		svg.append("text")             
			.attr("transform",
			"translate(" + (width/2) + " ," + 
			           (height + margin.top + 100) + ")")
			.style("text-anchor", "middle")
			.text("Player 1");

		  svg.append("text")
		      .attr("transform", "rotate(-90)")
		      .attr("y", 0 - margin.left)
		      .attr("x",0 - (height / 2))
		      .attr("dy", "1em")
		      .style("text-anchor", "middle")
		      .text("Player 2");  

		/** Scatter PLot for chart 1**/      
		svg.selectAll("dot")
				.data(dataPlayers)
				.enter()
				.append("circle")                               
				.attr("r", 10)    
				.attr("cx", function(d) { return (x(d.player1) + 50)} )         
				.attr("cy", function(d) { return (y(d.player2) + 25)} )
				.on("mouseover", function(d) {
					div.transition()		
					.duration(200)		
					.style("opacity", .9)	
					div.html(d.player1 + " vs " + d.player2)	
					.style("left", (d3.event.pageX + 10) + "px")		
					.style("top", (d3.event.pageY - 28) + "px");	
				})
				.on("mouseout", function(d) {		
					div.transition()		
					.duration(500)		
					.style("opacity", 0);	
				})
				.on("click", function(d) {

						d3
							.select("#svg2")
							.selectAll("*")
							.remove();

						d3
							.select("#svg3")
							.selectAll("*")
							.remove();

						FirstServe = []
						FirstServe.push({
								player: d.player1,
								speed: avgFirstServe[d.year][0]
							});
						FirstServe.push({
								player: d.player2,
								speed: avgFirstServe[d.year][1]
							});

						SecServe = []
						SecServe.push({
								player: d.player1,
								speed: avgSecServe[d.year][0]
							});
						SecServe.push({
								player: d.player2,
								speed: avgSecServe[d.year][1]
							});


						var players = [d.player1, d.player2];
						console.log(players);
						var x1 = d3.scaleBand()
							.domain(players)
							.rangeRound([0, width]);

						var y1 = d3.scaleLinear()
							.domain([200,0])
							.rangeRound([0, height]);

						var xAxis1 = d3.axisBottom(x1).ticks(2);
						var yAxis1 = d3.axisLeft(y1).ticks(10);

						var svg1 = d3.select("#svg2")
						    .attr("width", width1 + margin1.left + margin1.right)
						    .attr("height", height1 + margin1.top + margin1.bottom)
						  .append("g")
						    .attr("transform", 
						          "translate(" + margin1.left + "," + margin1.top + ")");

						/**  Plotting axes  **/
						svg1.append("g")
						      .attr("class", "x axis")
						      .attr("transform", "translate(0," + height + ")")
						      .call(xAxis1)
						    .selectAll("text")
						      .style("text-anchor", "end")
						      .attr("dx", "3.0em")
						      .attr("dy", "1em")
						      .attr("transform", "rotate(0)" );

						svg1.append("g")
						      .attr("class", "y axis")
						      .call(yAxis1)
						    .append("text")
						      .attr("transform", "rotate(-90)")
						      .attr("y", 6)
						      .attr("dy", ".71em")
						      .style("text-anchor", "end");

						      svg1.append("text")             
								.attr("transform",
								"translate(" + (width1/2) + " ," + 
								           (height1 + margin1.top + 110) + ")")
								.style("text-anchor", "middle")
								.text("Players");

							  svg1.append("text")
							      .attr("transform", "rotate(-90)")
							      .attr("y", 0 - 70)
							      .attr("x",0 - (height1 / 2))
							      .attr("dy", "1em")
							      .style("text-anchor", "middle")
							      .text("Average First Serve Speed");  

						svg1.selectAll(".bar")
							.data(FirstServe)
							.enter()
							.append("rect")
						      .attr("class", "bar")
						      .attr("x", function(d) { return x1(d.player) + 80; })
						      .attr("y", function(d) { return y1(d.speed ) + 100; } )
						      .attr("width", x1.bandwidth() - 150)
						      .attr("height", function(d) { return height1 - y1(d.speed); });



						var svg2 = d3.select("#svg3")
						    .attr("width", width1 + margin1.left + margin1.right)
						    .attr("height", height1 + margin1.top + margin1.bottom)
						  .append("g")
						    .attr("transform", 
						          "translate(" + margin1.left + "," + margin1.top + ")");

						/**  Plotting axes  **/
						svg2.append("g")
						      .attr("class", "x axis")
						      .attr("transform", "translate(0," + height + ")")
						      .call(xAxis1)
						    .selectAll("text")
						      .style("text-anchor", "end")
						      .attr("dx", "3.0em")
						      .attr("dy", "1em")
						      .attr("transform", "rotate(0)" );

						svg2.append("g")
						      .attr("class", "y axis")
						      .call(yAxis1)
						    .append("text")
						      .attr("transform", "rotate(-90)")
						      .attr("y", 6)
						      .attr("dy", ".71em")
						      .style("text-anchor", "end");

						      svg2.append("text")             
								.attr("transform",
								"translate(" + (width1/2) + " ," + 
								           (height1 + margin1.top + 110) + ")")
								.style("text-anchor", "middle")
								.text("Players");

							  svg2.append("text")
							      .attr("transform", "rotate(-90)")
							      .attr("y", 0 - 70)
							      .attr("x",0 - (height1 / 2))
							      .attr("dy", "1em")
							      .style("text-anchor", "middle")
							      .text("Average Second Serve Speed"); 

						svg2.selectAll(".bar")
							.data(SecServe)
							.enter()
							.append("rect")
						      .attr("class", "bar")
						      .attr("x", function(d) { console.log(d.player); return x1(d.player) + 80; })
						      .attr("y", function(d) { return y1(d.speed ) + 100; } )
						      .attr("width", x1.bandwidth() - 150)
						      .attr("height", function(d) { return height1 - y1(d.speed); });
							});



	});
});