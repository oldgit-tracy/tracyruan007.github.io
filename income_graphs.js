
var margin0 = {top: 40, right: 34, bottom: 100, left: 70},
    width0 = 660 - margin0.left - margin0.right,
    height0 = 600 - margin0.top - margin0.bottom;

        // append the svg1 obgect to the body of the page
        // appends a 'group' element to 'svg1'
        // moves the 'group' element to the top left margin0
var svg = d3.select("#lines_svg")
             .attr("width", width0 + margin0.left + margin0.right)
             .attr("height", height0 + margin0.top + margin0.bottom)
             .append("g")
             .attr("transform", "translate(" + margin0.left + "," + margin0.top + ")");


// set the ranges
var x0 = d3.scaleLinear().range([0, width0]);
var y0 = d3.scaleLinear().range([height0, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

    var line_low_income = d3.line()
        //.curve(d3.curveBasis)
        .x(function(d) { return x0(d.Var1); })
        .y(function(d) { return y0(d.Freq_y); });


    var line_high_income = d3.line()
                //.curve(d3.curveBasis)
        .x(function(d) { return x0(d.Var1); })
        .y(function(d) { return y0(d.Freq_x); });


// Get the data1
d3.csv("new_income_df2.csv", function(error, data1) {

console.log(data1);
    if (error) throw error;
    // format the data1
    data1.forEach(function(d1) {
      d1.Id = +d1.Id;
      d1.Var1 = +d1.Var1;
      d1.Freq_x = +d1.Freq_x;
      d1.Freq_y = +d1.Freq_y;
    });

  var incomes = data1.columns.slice(2).map(function(id) {
    return {
      id: id,
      values: data1.map(function(d) {
        return {Income: d.Var1, Count: d[id]};
    })
    };
   });


//console.log(data1)
    // Scale the range of the data1
    x0.domain(d3.extent(data1, function(d1) { return d1.Var1; }));


    y0.domain([
  d3.min(incomes, function(c) { return d3.min(c.values, function(d) { return d.Count; }); }),
  d3.max(incomes, function(c) { return d3.max(c.values, function(d) { return d.Count; }); })
]);
//
// z.domain(incomes.map(function(c) { return c.id; }));

data1.sort(function(a, b){return a.Var1-b.Var1}); // sort data1 in ascending order

                // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height0 + ")")
                .call(d3.axisBottom(x0));

                // text label for the x axis
            svg.append("text")
              .attr("transform", "translate(" + 250+ " ," + (height0 + margin0.top ) + ")")
              //.style("text-anchor", "middle")
              .text("Income Percentile");

              // Add the Y Axis
            svg.append("g")
            // .attr("class", "axis")
              .call(d3.axisLeft(y0));

// console.log(data1);
              //line
            svg.append("path")
              .data([data1])
              .attr("class", "line")
              .attr("id", "blueLine")
              .attr("d", line_low_income)
              .style("stroke", "lightblue");


                //line
              svg.append("path")
                .data([data1])
                .attr("class", "line")
                .attr("d", line_high_income)
                .attr("id", "greenLine")
                .style("stroke", "lightgreen");

              // text label for the y axis
            svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0-70)
              .attr("x",0 - (height0 / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Count of customers");

              // Title
            svg.append("text")
              .attr("transform", "translate(" + (width0/2) + " ," + -15 + ")")
              .attr('stroke', 'black')
              .style("font-size", "25px")
              .style("text-anchor", "middle")
              .text("Impact of Income");



var income = svg.selectAll(".income")
    .data(data1)
    .enter().append("g")
      .attr("class", "income");
      // console.log(income);


      // add the dots with tooltips
  svg.selectAll(".shapes")
     .data(data1)
   .enter().append("circle")
     .attr("r", 2)
     .attr("cx", function(d) { return x0(d.Var1); })
     .attr("cy", function(d) { return y0(d.Freq_y); })
     .attr("fill","blue")


    svg.selectAll(".shapes")
       .data(data1)
     .enter().append("circle")
       .attr("r", 2)
       .attr("cx", function(d) { return x0(d.Var1); })
       .attr("cy", function(d) { return y0(d.Freq_x); })
       .attr("fill","green")


        var mouseG = svg
            // .append("g")
             .attr("class", "mouse-over-effects");

           mouseG.append("path") // this is the black vertical line to follow mouse
             .attr("class", "mouse-line")
             .style("stroke", "black")
            //  .style("stroke-width", "1px")
             .style("opacity", "0")
             ;

             var lines = document.getElementsByClassName('line');
            // console.log(lines);
             var mousePerLine = mouseG.selectAll('.mouse-per-line')
               .data(incomes)
               .enter()
               .append("g")
               .attr("class", "mouse-per-line");
            // console.log(mousePerLine);

            //  text color
           mousePerLine.raise().append("text")
             .attr("transform", "translate(10,20)")
             .attr("fill", function(d2) {return color(d2.id);})
            //  console.log(mousePerLine);

        //console.log(mousePerLine);
           mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
             .attr('width', width0) // can't catch mouse events on a g element
             .attr('height', height0)
             .attr('fill', 'none')
             .attr('pointer-events', 'all')
             .on('mouseout', function() { // on mouse out hide line and text
               d3.select(".mouse-line")
                 .style("opacity", "0.1");
               d3.selectAll(".mouse-per-line text")
                 .style("opacity", "1");
             })
             .on('mouseover', function() { // on mouse in show line and text
               d3.select(".mouse-line")
                 .style("opacity", "0.5");
               d3.selectAll(".mouse-per-line text")
                 .style("opacity", "0.8")
                 .style("font-size", "15px");
             })
             .on('mousemove', function() { // mouse moving over canvas
               var mouse = d3.mouse(this);
               d3.select(".mouse-line")
                 .attr("d", function() {
                   var m = "M" + mouse[0] + "," + height0;
                   m += " " + mouse[0] + "," + 0;
                   return m;
                 });
// console.log(mousePerLine);
               d3.selectAll(".mouse-per-line")
                 .attr("transform", function(d,i) {
                  //  console.log(d,i,lines)
                   //console.log(width1/mouse[0])
                   // console.log("hi",d,i)
                              var beginning = 0,
                                  end = lines[i].getTotalLength(),
                                  target = null;
                  //  console.log(lines[i]);
                              while (true){
                                target = Math.floor((beginning + end) / 2);

                                pos = lines[i].getPointAtLength(target);
                                // console.log(pos);
                                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0])      end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                                else break; //position found
                              }

                              d3.select(this).select('text')
                                .text(y0.invert(pos.y).toFixed(0));

                                // console.log(y0.invert(pos.y).toFixed(0));

                                var trans_x = mouse[0];
                          // if(i == 0 && 2014 < x.invert(mouse[0])){
                          //  trans_x = trans_x - 70;
                          // }
                                return "translate(" + trans_x + "," + pos.y +")";
                            });
                   });

                   // rectangle for blue legend
                   svg.append('rect')
                   .attr("x", 0)
                   .attr("y", height0 + margin0.top + 10)
                   .attr("width", 10)
                   .attr("height", 10)
                   .style("fill", "lightblue")
                   //.attr("id", "blueRect");

                   // rectangle for green legend
                   svg.append('rect')
                   .attr("x", 385)
                   .attr("y", height0 + margin0.top + 10)
                   .attr("width", 10)
                   .attr("height", 10)
                   .style("fill", "lightgreen")
                   ;


// modified code from https://bl.ocks.org/d3noob/4abb9dc578abf070fe62302282a29c41
                   // add the blue line legend
                   svg.append("text")
                    .attr("x", 15)
                    .attr("y", height0 + margin0.top + 20)
                    .attr("class", "legend")
                    .style("fill", "lightblue")
                    .on("click", function(){
                      // Determine if current line is visible
                      var active   = blueLine.active ? false : true ,
                      newOpacity = active ? 0 : 1;
                      // console.log('newOpacity', newOpacity);
                      // Hide or show the elements
                      //  currentColor = "lightblue" ? "yellow" : "lightblue";
                      // d3.select("#blueLine").style("stroke", 'currentColor');
                      // d3.select("#blueLine").style("opacity",);
                      d3.select("#blueLine").style("opacity", newOpacity);
                      // Update whether or not the elements are active
                      blueLine.active = active;
                      // console.log(blueLine);
                    })
                    .text("Low Propensity Income");


                     // Add the green line title
                     svg.append("text")
                      .attr("x", 400)
                      .attr("y", height0 + margin0.top + 20)
                      .attr("class", "legend")
                      .style("fill", "lightgreen")
                      .on("click", function(){
                        // Determine if current line is visible
                        var active   = line_high_income.active ? false : true,
                          newOpacity = active ? 0 : 1;
                        // Hide or show the elements
                        d3.select("#greenLine").style("opacity", newOpacity);
                        // d3.select("#blueDot").style("opacity", newOpacity);
                        // Update whether or not the elements are active
                        line_high_income.active = active;
                      })
                      .text("High Propensity Income");
// console.log(blueLine);



});


var margin0 = {top: 40, right: 34, bottom: 100, left: 70},
    width0 = 660 - margin0.left - margin0.right,
    height0 = 600 - margin0.top - margin0.bottom;

        // append the svg1 obgect to the body of the page
        // appends a 'group' element to 'svg1'
        // moves the 'group' element to the top left margin0
var svg_l = d3.select("#incomeline_svg")
             .attr("width", width0 + margin0.left + margin0.right)
             .attr("height", height0 + margin0.top + margin0.bottom)
             .append("g")
             .attr("transform", "translate(" + margin0.left + "," + margin0.top + ")");


// set the ranges
var x0_l = d3.scaleLinear().range([0, width0]);
var y0_l = d3.scaleLinear().range([height0, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

    var income_line_l = d3.line()
        //.curve(d3.curveBasis)
        .x(function(d) { return x0_l(d.Id); })
        .y(function(d) { return y0_l(d.income); });


// Get the data1
d3.csv("newDF_income.csv", function(error, data1) {
    // console.log(data1)
    // debugger;
// console.log(data1);
    if (error) throw error;
    // format the data1
    data1.forEach(function(d1) {
      d1.Id = +d1.Id;
      d1.income = +d1.income;
      // console.log(data1)
    });

  var incomes_l = data1.columns.slice(0).map(function(id) {
    return {
      id: id,
      values: data1.map(function(d) {
        return {probability: d.income, Count: d[id]};
    })
    };
   });


//console.log(data1)
    // Scale the range of the data1
    x0_l.domain(d3.extent(data1, function(d1) { return d1.Id; }));

    y0_l.domain([0,1]);

data1.sort(function(a, b){return a.Id-b.Id}); // sort data1 in ascending order

                // Add the X Axis
            svg_l.append("g")
                .attr("transform", "translate(0," + height0 + ")")
                .call(d3.axisBottom(x0_l));

                // text label for the x axis
            svg_l.append("text")
              .attr("transform", "translate(" + 250+ " ," + (height0 + margin0.top ) + ")")
              //.style("text-anchor", "middle")
              .text("Income Percentile");


              // Add the Y Axis
            svg_l.append("g")
            // .attr("class", "axis")
              .call(d3.axisLeft(y0_l));



// console.log(data1);
              //line
            svg_l.append("path")
              .data([data1])
              .attr("class", "line_l")
              .attr("id", "blueLine")
              .attr("d", income_line_l)
              .style("stroke", "lightblue");


              // text label for the y axis
            svg_l.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0-70)
              .attr("x",0 - (height0 / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Probability");

              // Title
            svg_l.append("text")
              .attr("transform", "translate(" + (width0/2) + " ," + -15 + ")")
              .attr('stroke', 'black')
              .style("font-size", "25px")
              .style("text-anchor", "middle")
              .text("Impact of Income");



var income_l = svg_l.selectAll(".income")
    .data(data1)
    .enter().append("g")
      .attr("class", "income");
      // console.log(income);


      // add the dots with tooltips
  svg_l.selectAll(".shapes")
     .data(data1)
   .enter().append("circle")
     .attr("r", 2)
     .attr("cx", function(d) { return x0_l(d.Id); })
     .attr("cy", function(d) { return y0_l(d.income); })
     .attr("fill","blue")


        var mouseG_l = svg_l
            // .append("g")
             .attr("class", "mouse-over-effects");

           mouseG_l.append("path") // this is the black vertical line to follow mouse
             .attr("class", "mouse-line_l")
             .style("stroke", "black")
            //  .style("stroke-width", "1px")
             .style("opacity", "0")
             ;

             var lines_l = document.getElementsByClassName('line_l');
            console.log(lines_l);
             var mousePerLine_l = mouseG_l.selectAll('.mouse-per-line_l')
               .data(incomes_l)
               .enter()
               .append("g")
               .attr("class", "mouse-per-line_l");


            //  text color
           mousePerLine_l.raise().append("text")
             .attr("transform", "translate(10,20)")
             .attr("fill", function(d2) {return color(d2.Id);})
            //  console.log(mousePerLine);

        //console.log(mousePerLine);
           mouseG_l.append('svg:rect') // append a rect to catch mouse movements on canvas
             .attr('width', width0) // can't catch mouse events on a g element
             .attr('height', height0)
             .attr('fill', 'none')
             .attr('pointer-events', 'all')
             .on('mouseout', function() { // on mouse out hide line and text
               d3.select(".mouse-line_l")
                 .style("opacity", "0.1");
               d3.selectAll(".mouse-per-line_l text")
                 .style("opacity", "1");
             })
             .on('mouseover', function() { // on mouse in show line and text
               d3.select(".mouse-line_l")
                 .style("opacity", "0.5");
               d3.selectAll(".mouse-per-line_l text")
                 .style("opacity", "0.8")
                 .style("font-size", "15px");
             })
             .on('mousemove', function() { // mouse moving over canvas
               var mouse = d3.mouse(this);
               d3.select(".mouse-line_l")
                 .attr("d", function() {
                   var m = "M" + mouse[0] + "," + height0;
                   m += " " + mouse[0] + "," + 0;
                   return m;
                 });
// console.log(mousePerLine);
               d3.selectAll(".mouse-per-line_l")
                 .attr("transform", function(d,i) {
                  //  console.log(d,i,lines)
                  //  console.log(lines[0])
                              var beginning = 0,
                                  end = lines_l[0].getTotalLength(),
                                  target = null;
                  //  console.log(lines[i]);
                              while (true){
                                target = Math.floor((beginning + end) / 2);

                                pos = lines_l[0].getPointAtLength(target);
                                // console.log(pos);
                                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0])      end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                                else break; //position found
                              }

                              d3.select(this).select('text')
                                .text(y0_l.invert(pos.y).toFixed(6));

                                // console.log(y0.invert(pos.y).toFixed(0));

                                var trans_x = mouse[0];
                          // if(i == 0 && 2014 < x.invert(mouse[0])){
                          //  trans_x = trans_x - 70;
                          // }
                                return "translate(" + trans_x + "," + pos.y +")";
                            });
                   });

});


//zoomed y-axis version
var margin0 = {top: 40, right: 34, bottom: 100, left: 70},
    width0 = 660 - margin0.left - margin0.right,
    height0 = 600 - margin0.top - margin0.bottom;

        // append the svg1 obgect to the body of the page
        // appends a 'group' element to 'svg1'
        // moves the 'group' element to the top left margin0
var svg_n = d3.select("#incomeline2_svg")
             .attr("width", width0 + margin0.left + margin0.right)
             .attr("height", height0 + margin0.top + margin0.bottom)
             .append("g")
             .attr("transform", "translate(" + margin0.left + "," + margin0.top + ")");


// set the ranges
var x0_n = d3.scaleLinear().range([0, width0]);
var y0_n = d3.scaleLinear().range([height0, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory10);

    var income_line2 = d3.line()
        //.curve(d3.curveBasis)
        .x(function(d) { return x0_n(d.Id); })
        .y(function(d) { return y0_n(d.income); });


// Get the data1
d3.csv("newDF_income.csv", function(error, data1) {
    // console.log(data1)
    // debugger;
// console.log(data1);
    if (error) throw error;
    // format the data1
    data1.forEach(function(d1) {
      d1.Id = +d1.Id;
      d1.income = +d1.income;
      // console.log(data1)
    });

  var incomes2 = data1.columns.slice(0).map(function(id) {
    return {
      id: id,
      values: data1.map(function(d) {
        return {probability: d.income, Count: d[id]};
    })
    };
   });


//console.log(data1)
    // Scale the range of the data1
    x0_n.domain(d3.extent(data1, function(d1) { return d1.Id; }));

    y0_n.domain([0.7,0.9]);

data1.sort(function(a, b){return a.Id-b.Id}); // sort data1 in ascending order

                // Add the X Axis
            svg_n.append("g")
                .attr("transform", "translate(0," + height0 + ")")
                .call(d3.axisBottom(x0_n));

                // text label for the x axis
            svg_n.append("text")
              .attr("transform", "translate(" + 250+ " ," + (height0 + margin0.top ) + ")")
              //.style("text-anchor", "middle")
              .text("Income Percentile");


              // Add the Y Axis
            svg_n.append("g")
              .call(d3.axisLeft(y0_n));



// console.log(data1);
              //line
            svg_n.append("path")
              .data([data1])
              .attr("class", "line_n")
              .attr("id", "blueLine")
              .attr("d", income_line2)
              .style("stroke", "lightblue");


              // text label for the y axis
            svg_n.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0-70)
              .attr("x",0 - (height0 / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Probability");

              // Title
            svg_n.append("text")
              .attr("transform", "translate(" + (width0/2) + " ," + -15 + ")")
              .attr('stroke', 'black')
              .style("font-size", "25px")
              .style("text-anchor", "middle")
              .text("Impact of Income");



var income2 = svg_n.selectAll(".income")
    .data(data1)
    .enter().append("g")
      .attr("class", "income");
      // console.log(income);


      // add the dots with tooltips
  svg_n.selectAll(".shapes")
     .data(data1)
   .enter().append("circle")
     .attr("r", 2)
     .attr("cx", function(d) { return x0_n(d.Id); })
     .attr("cy", function(d) { return y0_n(d.income); })
     .attr("fill","blue")


        var mouseG = svg_n
            // .append("g")
             .attr("class", "mouse-over-effects");

           mouseG.append("path") // this is the black vertical line to follow mouse
             .attr("class", "mouse-line_n")
             .style("stroke", "black")
            //  .style("stroke-width", "1px")
             .style("opacity", "0")
             ;

             var lines = document.getElementsByClassName('line_n');
            console.log(lines);
             var mousePerLine = mouseG.selectAll('.mouse-per-line_n')
               .data(incomes2)
               .enter()
               .append("g")
               .attr("class", "mouse-per-line_n");
            // console.log(mousePerLine);

            //  text color
           mousePerLine.raise().append("text")
             .attr("transform", "translate(10,20)")
             .attr("fill", function(d2) {return color(d2.Id);})
            //  console.log(mousePerLine);

        //console.log(mousePerLine);
           mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
             .attr('width', width0) // can't catch mouse events on a g element
             .attr('height', height0)
             .attr('fill', 'none')
             .attr('pointer-events', 'all')
             .on('mouseout', function() { // on mouse out hide line and text
               d3.select(".mouse-line_n")
                 .style("opacity", "0.1");
               d3.selectAll(".mouse-per-line_n text")
                 .style("opacity", "1");
             })
             .on('mouseover', function() { // on mouse in show line and text
               d3.select(".mouse-line_n")
                 .style("opacity", "0.5");
               d3.selectAll(".mouse-per-line_n text")
                 .style("opacity", "0.8")
                 .style("font-size", "15px");
             })
             .on('mousemove', function() { // mouse moving over canvas
               var mouse = d3.mouse(this);
               d3.select(".mouse-line_n")
                 .attr("d", function() {
                   var m = "M" + mouse[0] + "," + height0;
                   m += " " + mouse[0] + "," + 0;
                   return m;
                 });
// console.log(mousePerLine);
               d3.selectAll(".mouse-per-line_n")
                 .attr("transform", function(d,i) {
                  //  console.log(d,i,lines)
                  //  console.log(lines[0])
                              var beginning = 0,
                                  end = lines[0].getTotalLength(),
                                  target = null;
                  //  console.log(lines[i]);
                              while (true){
                                target = Math.floor((beginning + end) / 2);

                                pos = lines[0].getPointAtLength(target);
                                // console.log(pos);
                                if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                                    break;
                                }
                                if (pos.x > mouse[0])      end = target;
                                else if (pos.x < mouse[0]) beginning = target;
                                else break; //position found
                              }

                              d3.select(this).select('text')
                                .text(y0_n.invert(pos.y).toFixed(6));

                                // console.log(y0.invert(pos.y).toFixed(0));

                                var trans_x = mouse[0];
                          // if(i == 0 && 2014 < x.invert(mouse[0])){
                          //  trans_x = trans_x - 70;
                          // }
                                return "translate(" + trans_x + "," + pos.y +")";
                            });
                   });

});



 // Histogram for low Probability
var margin1 = {top: 40, right: 10, bottom: 100, left: 50},
    width1 = 650 - margin1.left - margin1.right,
    height1 = 600- margin1.top - margin1.bottom;

var x1 = d3.scaleBand().rangeRound([0, width1]).padding(0.1),
    y1 = d3.scaleLinear().rangeRound([height1, 0]);

var svg1 = d3.select("#bar1_svg")
      .attr("width", width1 + margin1.left + margin1.right)
      .attr("height", height1 + margin1.top + margin1.bottom);

var g1 = svg1.append("g")
    .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

d3.csv("low_income2.csv", function(d) {
      // d.Id = +d.Id;
       d.Var1 = +d.Var1;
       d.Freq = +d.Freq;
  return d;
}, function(error, data) {
  if (error) throw error;

// console.log(data);

  var low_income_bar = data.columns.slice(2).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {Var1: d.Var1, Count: d[id]};
    })
    };
   });

data.sort(function(a, b){return a.Var1-b.Var1}); // sort data1 in ascending order


  x1.domain(data.map(function(d) { return d.Var1; }));
  y1.domain([0, d3.max(data, function(d) { return d.Freq; })]);

      //x-axis
  g1.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height1 + ")")
      .call(d3.axisBottom(x1));

    // text for x-axis
    g1.append("text")
        .attr("transform", "translate(" + width1/2+ " ," + (height1 + margin1.top ) + ")")
        .style("text-anchor", "middle")
        .text("Income Percentile");


      // y-axis
  g1.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y1))

      // text for y-axis
      g1.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0-45)
      .attr("x",0 - (height1 / 2))
      .attr("dy", "0.71em")
      .attr("text-anchor", "middle")
      .text("Count of Customers");

  g1.append("text")
      .attr("transform", "translate(" + (width1/2) + " ," + -15 + ")")
      .attr('stroke', 'black')
      .style("font-size", "25px")
      .style("text-anchor", "middle")
      .text("Customer Distribution on Income Variable");

  g1.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x1(d.Var1); })
      .attr("y", function(d) { return y1(d.Freq); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height1 - y1(d.Freq); })
      .attr("fill", "lightblue")
      .on("mouseover", function() { tooltip1.style("display", null); })
      .on("mouseout", function() { tooltip1.style("display", "none"); })
      .on("mousemove", function(d) {
        var xPosition = d3.mouse(this)[0] - 5;
        var yPosition = d3.mouse(this)[1] - 5;
        tooltip1.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
        tooltip1.select("text").text(d.Freq);
      });

// Prep the tooltip bits, initial display is hidden
var tooltip1 = g1.append("g")
.attr("class", "tooltip")
.style("display", "none");
//console.log(tooltip);
tooltip1.append("rect")
.attr("width", 60)
.attr("height", 20)
.attr("fill", "white")
.style("opacity", 0.5);

tooltip1.append("text")
.attr("x", 30)
.attr("dy", "1.2em")
.style("text-anchor", "middle")
.attr("font-size", "12px")
.attr("font-weight", "bold");
});



// Histogram for High Probability
var margin3 = {top: 40, right: 10, bottom: 100, left: 60},
   width3 = 700 - margin3.left - margin3.right,
   height3 = 600- margin3.top - margin3.bottom;

var x3 = d3.scaleBand().rangeRound([0, width3]).padding(0.1),
   y3 = d3.scaleLinear().rangeRound([height3, 0]);

var svg3 = d3.select("#bar3_svg")
     .attr("width", width3 + margin3.left + margin3.right)
     .attr("height", height3 + margin3.top + margin3.bottom);

var g3 = svg3.append("g")
   .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

d3.csv("high_income2.csv", function(d) {
     // d.Id = +d.Id;
      d.Var1 = +d.Var1;
      d.Freq = +d.Freq;
 return d;
}, function(error, data) {
 if (error) throw error;

// console.log(data);

 var high_income_bar = data.columns.slice(2).map(function(id) {
   return {
     id: id,
     values: data.map(function(d) {
       return {Var1: d.Var1, Count: d[id]};
   })
   };
  });
  // console.log(high_income_bar);

  data.sort(function(a, b){return a.Var1-b.Var1}); // sort data1 in ascending order

 x3.domain(data.map(function(d) { return d.Var1; }));
 y3.domain([0, d3.max(data, function(d) { return d.Freq; })]);

     //x-axis
 g3.append("g")
     .attr("class", "axis")
     .attr("transform", "translate(0," + height3 + ")")
     .call(d3.axisBottom(x3));

   // text for x-axis
   g3.append("text")
       .attr("transform", "translate(" + width1/2+ " ," + (height3 + margin3.top ) + ")")
       .style("text-anchor", "middle")
       .text("Income Percentile");


     // y-axis
 g3.append("g")
     .attr("class", "axis")
     .call(d3.axisLeft(y3))

     // text for y-axis
     g3.append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 0-52)
     .attr("x",0 - (height3 / 2))
     .attr("dy", "0.71em")
     .attr("text-anchor", "middle")
     .text("Count of Customers");

 g3.append("text")
     .attr("transform", "translate(" + (width3/2) + " ," + -15 + ")")
     .attr('stroke', 'black')
     .style("font-size", "25px")
     .style("text-anchor", "middle")
     .text("Customer Distribution on Income Variable");

 // var tooltip = d3.select("body").append("div").attr("class", "toolTip");

 g3.selectAll(".bar")
   .data(data)
   .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return x3(d.Var1); })
     .attr("y", function(d) { return y3(d.Freq); })
     .attr("width", x3.bandwidth())
     .attr("height", function(d) { return height3 - y3(d.Freq); })
     .attr("fill", "lightgreen")
     .on("mouseover", function() { tooltip3.style("display", null); })
     .on("mouseout", function() { tooltip3.style("display", "none"); })
     .on("mousemove", function(d) {
       var xPosition = d3.mouse(this)[0] - 5;
       var yPosition = d3.mouse(this)[1] - 5;
       tooltip3.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
       tooltip3.select("text").text(d.Freq);
     });

    // Prep the tooltip bits, initial display is hidden
      var tooltip3 = g3.append("g")
        .attr("class", "tooltip")
        .style("display", "none");
        //console.log(tooltip);
      tooltip3.append("rect")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

      tooltip3.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold");

});





// modified code from https://bl.ocks.org/mbostock/3887051
var marginI = {top: 40, right: 10, bottom: 100, left: 45},
    widthI = 680- marginI.left - marginI.right,
    heightI = 650 - marginI.top - marginI.bottom,


     svgI = d3.select("#multiline_svg")
         .attr("width", widthI + marginI.left + marginI.right)
         .attr("height", heightI + marginI.top + marginI.bottom);
    g9 = svgI.append("g").attr("transform", "translate(" + marginI.left + "," + marginI.top + ")");

var xI0 = d3.scaleBand()
    .rangeRound([0, widthI])
    .paddingInner(0.1);

var xI1 = d3.scaleBand()
    .padding(0.05);

var yI = d3.scaleLinear()
    .rangeRound([heightI, 0]);

var z = d3.scaleOrdinal()
    .range(["lightblue",  "lightgreen"]);

d3.csv("new_income_df.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

// console.log(data);
data.sort(function(a, b){return a.Var1-b.Var1}); // sort data2 in ascending order

  var keys = data.columns.slice(2);
// console.log(keys);

  xI0.domain(data.map(function(d) { return d.Var1; }));
  xI1.domain(keys).rangeRound([0, xI0.bandwidth()]);
  yI.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g9.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + heightI + ")")
      .call(d3.axisBottom(xI0));

      // text for x-axis
      g9.append("text")
          .attr("transform", "translate(" + widthI/2+ " ," + (heightI + marginI.top ) + ")")
          .style("text-anchor", "middle")
          .text("Income Percentile");


       // y-axis
   g9.append("g")
       .attr("class", "axis")
       .call(d3.axisLeft(yI))

       // text for y-axis
       g9.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", 0-45)
       .attr("x",0 - (heightI / 2))
       .attr("dy", "0.71em")
       .attr("text-anchor", "middle")
       .text("Count of Customers");

  var legend2 = g9.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend2.append("rect")
      .attr("x", widthI - 90)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend2.append("text")
      .attr("x", widthI - 100)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });


         g9.append("g")
           .selectAll("g")
           .data(data)
           .enter().append("g")
             .attr("transform", function(d) { return "translate(" + xI0(d.Var1) + ",0)"; })
           .selectAll("rect")
           .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
           .enter().append("rect")
             .attr("x", function(d) { return xI1(d.key); })
             .attr("y", function(d) { return yI(d.value); })
             .attr("width", xI1.bandwidth())
             .attr("height", function(d) { return heightI - yI(d.value); })
             .attr("fill", function(d) { return z(d.key); })
             .on("mouseover", function() { tooltipI.style("display", null); })
             .on("mouseout", function() { tooltipI.style("display", "none"); })
             .on("mousemove", function(d) {
               var xPosition = d3.mouse(this)[0] +20;
               var yPosition = d3.mouse(this)[1] - 40;
               tooltipI.attr("transform", "translate(" + xPosition + "," + 0 + ")");
              tooltipI.select("text").text("Count:"+d.value);
               });


             // Prep the tooltip bits, initial display is hidden
               var tooltipI = g9.append("g")
                 .attr("class", "tooltip")
                 .style("display", "none");
                 //console.log(tooltip);
               tooltipI.append("rect")
                 .attr("width", 600)
                 .attr("height", 20)
                 .attr("fill", "none")
                 .style("opacity", 0.5);

               tooltipI.append("text")
                 .attr("x", 30)
                 .attr("dy", "1.2em")
                 .style("text-anchor", "middle")
                 .attr("font-size", "20px")
                 .attr("font-weight", "bold");

});
