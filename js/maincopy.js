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
    'California'
    // 'Colorado',
    // 'Connecticut',
    // 'Delaware',
    // 'District of Columbia',
    // 'Florida',
    // 'Georgia',
    // 'Hawaii',
    // 'Idaho',
    // 'Illinois',
    // 'Indiana',
    // 'Iowa',
    // 'Kansas',
    // 'Kentucky',
    // 'Louisiana',
    // 'Maine',
    // 'Maryland',
    // 'Massachusetts',
    // 'Michigan',
    // 'Minnesota',
    // 'Mississippi',
    // 'Missouri',
    // 'Montana',
    // 'Nebraska',
    // 'Nevada',
    // 'New Hampshire',
    // 'New Jersey',
    // 'New Mexico',
    // 'New York',
    // 'North Carolina',
    // 'North Dakota',
    // 'Ohio',
    // 'Oklahoma',
    // 'Oregon',
    // 'Pennsylvania',
    // 'Rhode Island',
    // 'South Carolina',
    // 'South Dakota',
    // 'Tennessee',
    // 'Texas',
    // 'Utah',
    // 'Vermont',
    // 'Virginia',
    // 'Washington',
    // 'West Virginia',
    // 'Wisconsin',
    // 'Wyoming'
]
    


const margin = {left:80, right:20, top:50, bottom:100};
// const height = 500 - margin.top - margin.bottom,
const height = 600 - margin.top - margin.bottom,

// width = 800 - margin.left - margin.right;
width = 1100 - margin.left - margin.right;



const g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.top + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + 
        ", " + margin.top + ")");

let time = 0; 
let stateIndex = 0;

// //Scales
// let x = d3.scaleLinear()
//     .domain([
//         d3.min(data,function(d){return d.currentRating.score;}) - 5,
//         d3.max(data, function(d){return d.currentRating.score;}) + 5
//     ])
//     .range(
//         [0, width]
//     );

// var y = d3.scaleLinear()
//         .domain(
//             [
//                 d3.min(data,function(d){return d.financialRating.score;}) - 5,
//                 d3.max(data, function(d){return d.financialRating.score;}) + 5
//             ]
//         )
//         .range(
//             [height, 0]
//         );

// var area = d3.scaleLinear()
//         .domain(
//             [
//                 d3.min(data,function(d){return d.irsClassification.incomeAmount}) - 5,
//                 d3.max(data,function(d){return d.irsClassification.incomeAmount}) + 5,

//             ]
//         )
//         .range(
//             [25*Math.PI, 1500*Math.PI]
//         );

        
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
    .attr("x", width - 40)
    .attr("font-size", "40px")
    .attr("opacity", "0.4")
    .attr("text-anchor", "middle")
    .text("DEFAULT State Label");

// // X AXIS
// var xAxisCall = d3.axisBottom(x)
//     .ticks(10);
// g.append("g")
//     .attr("class", "x axis")
//     .attr("transform", "translate(0," + height + ")")
//     .call(xAxisCall);

// //Y AXIS -- not sure where the y-axis is coming into play
// var yAxisCall = d3.axisLeft(y)
//     .tickFormat(function(d){return +d;});
// g.append("g")
//     .attr("class", "y axis")
//     .call("yAxisCall");


d3.json("data/totalStatesData.json").then(function(data){
    console.log("HI");
    console.log(data);

    //cleaning data
    const formattedData = data.map(function(state){
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

    //Run the code every 1 seconds
    d3.interval(function(){
        //At the end of our data, loop back
        // time = (time < 51) ? time+1 : 0;
        time = (time < 4) ? time+1 : 0;
        update(formattedData[time], states[time]);}, 5000);
        
    //First run of the visualization
    update(formattedData[0], states[0]);
})

function update(data, state){
    console.log("IN UPDATE FUNCTION, PRINTING OUT DATA AND STAT")
    console.log("STATE")
    console.log(state);
    console.log(data);

//Scales
let x = d3.scaleLinear()
    .domain([
        d3.min(data,function(d){return d.currentRating.score;}) - 5,
        d3.max(data, function(d){return d.currentRating.score;}) + 5
    ])
    .range(
        [0, width]
    );

var y = d3.scaleLinear()
        .domain(
            [
                d3.min(data,function(d){return d.currentRating.financialRating.score;}) - 5,
                d3.max(data, function(d){return d.currentRating.financialRating.score;}) + 5
            ]
        )
        .range(
            [height, 0]
        );

var area = d3.scaleLinear()
        .domain(
            [
                d3.min(data,function(d){return d.irsClassification.incomeAmount}) - 5,
                d3.max(data,function(d){return d.irsClassification.incomeAmount}) + 5,

            ]
        )
        .range(
            [25*Math.PI, 1500*Math.PI]
        );


// X AXIS
var xAxisCall = d3.axisBottom(x)
    .ticks(10);
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxisCall);

//Y AXIS -- not sure where the y-axis is coming into play
var yAxisCall = d3.axisLeft(y)
    .tickFormat(function(d){return +d;});
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);

    //transition time for the visualization
    let t = d3.transition().duration(5000);

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
        .merge(circles)
        .transition(t)
            .attr("cy",function(d){return y(d.currentRating.financialRating.score)})
            .attr("cx", function(d){return x(d.currentRating.score)})
            .attr("r", function(d){return Math.sqrt(area(d.irsClassification.incomeAmount)/Math.PI);});
    
     //Update the time label
     stateLabel.text(state);
}

   

// });







