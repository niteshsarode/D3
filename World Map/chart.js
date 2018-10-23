$(document).ready(function() {

	$("#cmn-toggle-1").prop('checked', true);
	$("#cmn-toggle-2").prop('checked', true);	
	d3.csv ("world.csv", function (error, d ) {

		var dataDict = {}
		var bubbleData = []
		var r = 0;
		d.forEach(function(d) {		
			dataDict[d.id] = [d.Agriculture,d.Industry,d.Service,d.Country];
			if(d.PopDensity > 10000)
				r = 35;
			else if(d.PopDensity > 5000)
				r = 20;
			else if(d.PopDensity > 3000)
				r = 16;
			else if(d.PopDensity > 1000)
				r = 13;
			else if(d.PopDensity > 100)
				r = 10;
			else if(d.PopDensity >= 0)
				r = 6;
			bubbleData.push({
				radius: r,
				centered: d.id,
				popdensity: d.PopDensity,
				fillKey: d.id,
			})
		});

		function displayPieChart(data) {

			var tooltip = d3.select('#pie')                            
	          .append('div')                                               
	          .attr('class', 'tooltip');                                  
	                      
	        tooltip.append('div')                                          
	          .attr('class', 'name');                                    
	             
	        tooltip.append('div')                                           
	          .attr('class', 'value');                                                                 

            var newData = [];
			newData = [{
				"Name": "Agriculture",
				"Value": dataDict[data.id][0]
			},
			{
				"Name": "Industry",
				"Value": dataDict[data.id][1]
			},
			{
				"Name": "Service",
				"Value": dataDict[data.id][2]
			}];

			$('#country').text(dataDict[data.id][3]);

			var width = 300;
			var height = 300;
			var outradius = Math.min(width, height) / 2;
			var inradius = outradius / 1.50;

			var color = d3.scale.category10();

			cleanupSvg();
			var labelArc = d3.svg.arc()
			    .outerRadius(outradius - 50)
			    .innerRadius(inradius - 50);

			var svg = d3.select('#pie')
			  .append('svg')
			  .attr('width', width)
			  .attr('height', height)
			  .append('g')
			  .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

			var arc = d3.svg.arc()
			  .outerRadius(outradius)
			  .innerRadius(inradius);

			var pie = d3.layout.pie()
			  .value(function(d, i) {
			    return d.Value;
			  })
			  .sort(null);

			var path = svg.selectAll('path')
			  .data(pie(newData))
			  .enter()
			  .append('path')
			  .attr('d', arc)
			  .transition().delay(function(d, i) { return i * 500; }).duration(500)
			  .attrTween('d', function(d) {
			       var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
			       return function(t) {
			           d.endAngle = i(t);
			         return arc(d);
			       }
			  })
			  .attr('fill', function(d, i) {
			    return color(d.data.Name);
			  });

		  var text = svg.selectAll('text')
	           .data(pie(newData))
	           .enter()
	           .append("text")
	           .transition()
	           .duration(200)
	           .attr("transform", function(d) {
	               return "translate(" + arc.centroid(d) + ")";
	           })
	           .attr("dy", ".4em")
	           .attr("text-anchor", "middle")
	           .text(function(d) {
	               return (d.data.Value/10) + "%";
	           })
	           .style({
	               fill: '#fff',
	               'font-size': '10px'
	           });

			var legendRectSize =outradius * 0.08;
			var legendSpacing = outradius * 0.10;

			var legend = svg.selectAll('.legend')
		        .data(color.domain())
		        .enter()
		        .append('g')
		        .attr('class', 'legend')
		        .attr('transform', function(d, i) {
		            var height = legendRectSize + legendSpacing;
		            var offset =  height * color.domain().length / 3;
		            var horz = -4 * legendRectSize;
		            var vert = i * height - offset;
		            return 'translate(' + horz + ',' + vert + ')';
		        });

		    legend.append('rect')
		        .attr('width', legendRectSize)
		        .attr('height', legendRectSize)
		        .style('fill', color)
		        .style('stroke', color);

		    legend.append('text')
		        .attr('x', legendRectSize + legendSpacing)
		        .attr('y', legendRectSize - legendSpacing + 15)
		        .text(function(d) { return d; });

		}

		function displayPopulationMap() {
			$('#map').empty();
				var map = new Datamap({
					element: document.getElementById('map'),
					dataUrl: 'world.csv',
					dataType: 'csv',
					fills: {
			            'top10': '#008080',
			            'top50': '#20B2AA',
			            'top100': '#40E0D0',
			            'top150': '#7FFFD4',
			            'top230': '#ADD8E6', 
			            defaultFill: '#ADD8E6',
			        },
			        data : {},
			        geographyConfig: {
			        	popupTemplate: function(geo, data) {
		                   return data && data.Population && "<div class='hoverinfo'><strong>" + geo.properties.name + "<br>Population: " + data.Population + "</strong></div>";
		                },
			        	popupOnHover: true,
			        	highlightFillColor: true,
			        	highlightFillColor: function(data) {
			        		if (data.fillKey){
			        			return '#33A1C9';
			        		}
			        	},
			        },
			        done: function(datamap) {
				        datamap.svg.selectAll('.datamaps-subunit').on('click', function(data) {
							displayPieChart(data);			
				        });
			    	}
				});
		}

		function displayPopDensityMap() {
			$('#map').empty();
			var map = new Datamap({
			element: document.getElementById('map'),
			dataUrl: 'world1.csv',
			dataType: 'csv',
			fills: {
	            'top20': '#7C1E0A',
	            'top50': '#A1270D',
	            'top100': '#D03B1C',
	            'top150': '#ED6346',
	            'top180': '#EB7F69',
	            'top230': '#FCBAA9',
	            defaultFill: '#EDBFB5',
	        },
	        data : {},
	        geographyConfig: {
	        	popupTemplate: function(geo, data) {
                   return data && data.Population && "<div class='hoverinfo'><strong>" + geo.properties.name + "<br>Population Density: " + data.PopDensity + "</strong></div>";
                },
	        	popupOnHover: true,
	        	highlightFillColor: true,
	        	highlightFillColor: function(data) {
	        		if (data.fillKey){
	        			return '#33A1C9';
	        		}
	        	},
	        },
	        done: function(datamap) {
		        datamap.svg.selectAll('.datamaps-subunit').on('click', function(data) {
		            	displayPieChart(data);
			        });
		    	}
			});
		}

		function displayBubbleMap() {
			cleanupSvg();

			$('#map').empty();
			var bubble_map = new Datamap({
			 	element: document.getElementById("map"),
			 	dataUrl: 'world.csv',
				dataType: 'csv',
				fills: {
		            defaultFill: '#4665CB',
				},
				data: {},
				geographyConfig: {
					popupOnHover: false,
					highlightOnHover: false,
				},
			});
			bubble_map.bubbles(bubbleData, {
				  	popupTemplate: function(geo, data) {
		                   return "<div class='hoverinfo'><strong>" + data.fillKey + "<br>Population Density: " + data.popdensity + "</strong></div>";
	                }
				}
			);
		}

		function cleanupSvg() {
			d3
				.select("#pie")
				.selectAll("*")
				.remove();
		}

		displayPopulationMap();
		var popBox = document.getElementById("cmn-toggle-1");
		var mapBox = document.getElementById("cmn-toggle-2");
		$('#cmn-toggle-1').change(function(){
			if (popBox.checked == true) {
				$('#country').text("");
				cleanupSvg();
				displayPopulationMap();
			} else {
				$('#country').text("");
				cleanupSvg();
				displayPopDensityMap();
			}
		})
		$('#cmn-toggle-2').change(function(){
			if (mapBox.checked == true) {
				$( "#cmn-toggle-1").prop( 'disabled', false );
				$('#country').text("");
				displayPopDensityMap()
			} else {
				displayBubbleMap();
				$('#country').text("");
				$("#cmn-toggle-1").prop('checked', false);
				$("#cmn-toggle-1").prop('disabled', true );
			}
		})
	});
});