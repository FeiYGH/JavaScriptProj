/*
*    main.js
*    Charities Scatter Plot using D3.js
*    Fei Yang
*/
const states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'District of Columbia',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',

    'Utah',
    'Vermont',
    'Virgin Islands',
    'Virginia',

    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming'
]

var categories = [
    "Animals", 
    "Arts, Culture, Humanities",
    "Education",
    "Environment",
    "Health",
    "Human Services",
    "International",
    "Human and Civil Rights",
    "Religion",
    "Community Development",
    "Research and Public Policy"
];



const margin = {left:80, right:20, top:100, bottom:100};
// const height = 500 - margin.top - margin.bottom,
const height = 650 - margin.top - margin.bottom,

// width = 800 - margin.left - margin.right;
width = 1100 - margin.left - margin.right;



const g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.top + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
        ", " + margin.top + ")");



let stateIndex = 0;
let interval;
var formattedData;

//Tooltip
//returns the object that we're looking at
var tip = d3.tip().attr("class", "d3-tip")
    .html(function(d){
        
        let text= "<strong>Charity:  </strong><span style='color:white; text-tranform:capitalize'>" + d.charityName + "</span><br>";
        text+="<strong>Tagline:  </strong><span style='color:white'>" + d.tagLine + "</span><br>";
        text+="<strong>Cause:  </strong><span style='color:white'>" + d.cause.causeName + "</span><br>";
        text+="<strong>Web URL:  </strong><span style='color:white'>" + d.websiteURL + "</span><br>";
        text+="<strong>Overall Rating:  </strong><span style='color:white'>" + d3.format(".2f")(d.currentRating.score) + "</span><br>";
        text+="<strong>Financial Rating:  </strong><span style='color:white'>" + d3.format(".2f")(d.currentRating.financialRating.score) + "</span><br>";
        text+="<strong>Accountability Rating:  </strong><span style='color:white'>" + d3.format(".2f")(d.currentRating.accountabilityRating.score) + "</span><br>";
        text+="<strong>Income Amount:  </strong><span style='color:white'>" + d3.format("$,.0f")(d.irsClassification.incomeAmount) + "</span><br>";
        text+="<strong>State:  </strong><span style='color:white'>" + d.mailingAddress.stateOrProvince + "</span><br>";
        text +="<span style='color:white'><img style='min-width:80px' src=" + d.cause.image + "/></span><br>";
        // text+="<span style='color:white'>" + d.charityNavigatorURL + "</span><br>";
      
        return text;
    });
//set context for tooltip
g.call(tip);

//Scales
let x = d3.scaleLinear()
    .range(
        [0, width]
    );

var y = d3.scaleLinear()
    .range(
        [height, 0]
    );

var area = d3.scaleLinear()    
    .range(
        [25*Math.PI, 1500*Math.PI]
    );

        
var categoryColor = d3.scaleOrdinal(d3.schemePaired);
// var categoryColor = d3.scaleOrdinal(d3.schemeSet3); //lighter colors;


//LABELS
var xLabel = g.append("text")
    .attr("y", height+50)
    .attr("x", width/2)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Overall Rating Score out of 100 (Charity Navigator)");

var yLabel = g.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", -170)
    .attr("font-size", "22px")
    .attr("text-anchor", "middle")
    .text("Financial rating out of 100");


var stateLabel = g.append("text")
    .attr("y", height  - 10)
    .attr("x", width - 100)
    .attr("font-size", "40px")
    .attr("opacity", "0.5")
    .attr("text-anchor", "middle")
    .text("DEFAULT State Label");

// //brief description
// let description = g.append("text")
//     .attr("y", height + 100)
//     .attr("x", 200)
//     .attr("font-size","14px")
//     .attr("text-anchor","middle")
//     .text("All data was pulled from API calls from Charity Navigator the week of May 19, 2020. All charities pull had a minimum rating of 3 out of 4.")

// // X AXIS
//put up here. Don't want to add new axes on top of visualization every time visualization updates. if put g.append("g")
// in update function, appending a separate group to visualization every time the loop runs and adding a new axis 
//onto each of these new groups;
//fix this by appending axis groups just once (HERE) and then by calling axisgenerators in our update function
//moved the call methods, which run these Access generators into update function
const xAxisGroup = g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    // .call(xAxisCall);

// //Y AXIS -- not sure where the y-axis is coming into play
const yAxisGroup = g.append("g")
    .attr("class", "y axis")
    // .call("yAxisCall");


//Setting a legend of categories
var legend = g.append("g")
    .attr("transform", "translate(" + (width-25) + "," + (height-275)+")");

categories.forEach(function(category,i){
    var legendRow = legend.append("g")
        .attr("transform", "translate(0, " + (i * 20) + ")");

    legendRow.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", categoryColor(category));

    legendRow.append("text")
        .attr("x",-10)
        .attr("y", 10)
        .attr("text-anchor", "end")
        .style("text-transform", "capitalize")
        .text(category);
    });


d3.json("data/totalStatesData.json").then(function(data){
    console.log("HI");
    console.log(data);

    //cleaning data
    formattedData = data.map(function(state){
        // var dataExists = (charity.financialRating.score && charity.rating && charity.irsClassification.incomeAmount && charity.currentRating.score);
        return state.charities.filter(function(charity){
            var dataExists = (charity.currentRating.financialRating.score && charity.currentRating.rating && charity.irsClassification.incomeAmount && charity.currentRating.score);
            return dataExists;
        }).map(function(charity){
            charity.currentRating.financialRating.score  = +charity.currentRating.financialRating.score;
            charity.irsClassification.incomeAmount = +charity.irsClassification.incomeAmount;
            charity.currentRating.score = +charity.currentRating.score;
            charity.currentRating.rating = +charity.currentRating.rating;
            return charity;
        }); 
    });

///////Run the code every 1 seconds
//    d3.interval(function(){
//     //At the end of our data, loop back
//     // time = (time < 51) ? time+1 : 0;
//     time = (time < 4) ? time+1 : 0;
//     update(formattedData[time], states[time]);}, 5000);
        
    //First run of the visualization
    update(formattedData[0], states[0]);
});

//for play button
$("#play-button")
    .on("click", function(){
        let button = $(this);
        if(button.text()==="Play"){
            button.text("Pause");
            interval = setInterval(step,3000);
        }else{
            button.text("Play");
            clearInterval(interval);
        }
    });

$("#reset-button")
    .on("click", function(){
        stateIndex = 0; 
        update(formattedData[stateIndex], states[0]);
    });

$("#category-select")
    .on("change", function(){
        update(formattedData[stateIndex], states[stateIndex]);
    });

$("#state-slider").slider({
    max:50,
    min:0,
    step:1,
    slide:function(event,ui){
        stateIndex = ui.value; 
        update(formattedData[stateIndex], states[stateIndex]);
    }
})

//whenever called, going to add 1 to value of stateIndex
function step(){
    //At the end of our data, loop back
    // time = (time < 51) ? time+1 : 0;
    stateIndex = (stateIndex < 51) ? stateIndex+1 : 0;
    update(formattedData[stateIndex], states[stateIndex]);
}

function update(data, state){
    console.log("IN UPDATE FUNCTION, PRINTING OUT DATA AND STATE");
    console.log("STATE");
    console.log(state);
    console.log(data);
    console.log("NUMBER OF STATES");
    console.log(states.length);

    //adding a filter data array
    let category = $("#category-select").val();
    console.log(category);
    data = data.filter(function(d){
        if(category==="all"){
            return true;
        }else {
            return d.category.categoryName===category;
        }
    });

//Scales
    x.domain([
    d3.min(data,function(d){return d.currentRating.score;}) - 5,
    d3.max(data, function(d){return d.currentRating.score;}) + 5
    ])

    y.domain(
        [
            d3.min(data,function(d){return d.currentRating.financialRating.score;}) - 5,
            d3.max(data, function(d){return d.currentRating.financialRating.score;}) + 5
        ]
    )


    area.domain(
        [
            d3.min(data,function(d){return d.irsClassification.incomeAmount}) - 5,
            d3.max(data,function(d){return d.irsClassification.incomeAmount}) + 5,

        ]
    )


    ////////////////calls to our axisGenerators are updating current Axis rather than adding new ones///////////////////////
    // X AXIS
    var xAxisCall = d3.axisBottom(x)
        .ticks(10);
    //Axis group was appended just once at top 
    xAxisGroup.call(xAxisCall);


    //Y AXIS -- not sure where the y-axis is coming into play
    var yAxisCall = d3.axisLeft(y)
        .tickFormat(function(d){return +d;});
    //Axis group was appended just once at top 
    yAxisGroup.call(yAxisCall);
   

    //transition time for the visualization
    let t = d3.transition().duration(1000);

    //JOIN new data with old elements.
    let circles = g.selectAll("circle").data(data, function(d){
        return d.charityName;
    });
    
    //EXIT old elements not present in new data
    circles.exit().attr("class", "exit").remove();

    //ENTER nw elements present in new data.
    circles.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("fill",function(d){
            return categoryColor(d.category.categoryID);
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .merge(circles)
        .transition(t)
            .attr("cy",function(d){return y(d.currentRating.financialRating.score)})
            .attr("cx", function(d){return x(d.currentRating.score)})
            .attr("r", function(d){return Math.sqrt(area(d.irsClassification.incomeAmount)/Math.PI);});
    
     //Update the state label
     stateLabel.text(state);
     //so label always get same value as label on bottom of the chart
     $("#stateName")[0].innerHTML= states[stateIndex];
     //as visualization updates, we want position of slider to gradually slide to right;
     $("#state-slider").slider("value", stateIndex);
}

   

