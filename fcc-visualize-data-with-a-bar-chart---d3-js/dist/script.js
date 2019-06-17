function DrawBar(dataset){
   var margin  = {
       top: 50,
       right: 20,
       bottom: 50,
       left: 100
     },
       width   = 800,
       height  = 400

 // функция для определения позиционирования в домене X и Y.
 var minDate = dataset[0][0].substr(0,4);
        minDate = new Date(minDate);
    var maxDate = dataset[dataset.length - 1][0].substr(0,4);
        maxDate = new Date(maxDate);

       // X-axis
 var xAxisScale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, width]);
        // Y-axis
  var yAxisScale = d3.scale.linear()
         .domain([0, d3.max(dataset, function(d) {
                   //get the 2nd column of json file
          return d[1];
        })
      ])
         .range([height, 0]);

  // данные под линией оси или числа слева по линии оси X
  var xAxis = d3.svg.axis().scale(xAxisScale).orient("bottom");

   var yAxis = d3.svg.axis()
       .scale(yAxisScale)
       .orient("left");
   
   var tooltip = d3.select('body')
       .append('div')
        .style({
        'position' : 'absolute',
        'padding' : '4px',
        'background' : '#fff',
        'border': '1px solid #000',
        'color':'#000'
        });

        // функция всплывающей подсказки
        function mouseoverHandler(d) {
   tooltip.transition().style('opacity', .8)
   tooltip
   .style({
      'left' : (d3.event.pageX + 10) + 'px',
       'top' : (d3.event.pageY + 15) + 'px'
            })
          .html('<p> Date: ' + d[0] + '</p>'
                  + '<p> Billions: ' + d[1] + '</p>')

   d3.select(this)
      .style('opacity', .1);
}

function mouseoutHandler(d) {
    tooltip
    .transition()
    .style('opacity', 0)
    d3.select(this)
      .style('opacity', 1);
}

function mouseMoving (d) {
    tooltip
    .style("top", (d3.event.pageY-10)+"px")
    .style("left",(d3.event.pageX+10)+"px");
    d3.select(this)
      .style('opacity', 0.7);
}

        //  блог кода выбирает панель id. график на веб стр. и добавляет svg. G-обеспечивает ориентир для добавления осей
        var svg= d3.select("#barGraph")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "graph-svg-component")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // добавляем бары к нашим диаграммам, прямоугольник с тисками для позиции X и Y
     svg.selectAll("bar")
      .data(dataset)
      .enter()
      .append("rect")
      .style("fill", "MediumSlateBlue")
      .attr({
            x: function(d, i) { return (i * (width / dataset.length)); },
            y: function(d) { return yAxisScale(d[1]); },
            width: (width / dataset.length),
            height: function(d){return height - yAxisScale(d[1]); }
   })
   // обработчик мыши 
    .on("mouseover", mouseoverHandler)
    .on("mousemove",mouseMoving)
  	.on("mouseout", mouseoutHandler);
  
    // добавлеям ось X, правильное положение с атрибутом преобразования,текст позиции
    svg.append("g")
           .attr("class", "x axis")
           .attr("transform", "translate(0, " + height + ")")
           .call(xAxis)
           .selectAll("text")
           .style("text-anchor", "end")
           .attr("dx", "-0.5em")
           .attr("dy", "-.55em")
           .attr("y", 30)
           .attr("transform", "rotate(-45)" )

       svg.append("g")
           .attr("class", "y axis")
           .call(yAxis)
           .append("text")
           .attr("transform", "rotate(-90)")
           .attr("y", -85)
           .attr("dy", "0.8em")
           .attr("text-anchor", "end")
           .text("Value (billions)");
}

//  вызываем набор данных/устанавливаем
d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(data) {
 var dataset = data.data;
  DrawBar(dataset);
 });