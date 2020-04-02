/*
*    main.js
*    Charities Scatter Plot using D3.js
*    Fei Yang
*/

//array of api to get data for different categories (1-11) with min rating of 3 and max rating of 4
const apiArray = [
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=1&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=2&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=3&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=4&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=5&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=6&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=7&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=8&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=9&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=10&minRating=3&maxRating=4",
    "https://api.data.charitynavigator.org/v2/Organizations?app_id=0f46ea13&app_key=7780b871244de17fae05c573d2fa3414&pageSize=999&rated=true&categoryID=11&minRating=3&maxRating=4"
]

var margin = {left:80, right:20, top:50, bottom:100};

var width = 1000 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


var g = d3.select("#chart-area")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var categoryID = 0;

//Labels
var xLabel = g.append("text")
	.attr("y", height + 50)
	.attr("x", width/2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("State");

var yLabel = g.append("text")
	.attr("y", -60)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.attr("transform", "rotate(-90)")
	.text("Income Amount per nonProfit");

var categoryLabel = g.append("text")
	.attr("y", height - 10)
	.attr("x", width -40)
	.attr("font-size", "30px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text("Animals");

const states = [ "AK",
"AL","AR","AZ",
"CA","CO","CT","DC","DE","FL","GA","HI","IA","ID","IL","IN","KS","KY","LA","MA","MD","ME",
"MI","MN","MO","MS","MT","NC","ND","NE","NH",
"NJ","NM","NV","NY","OH","OK","OR","PA","PR",
"RI","SC","SD","TN","TX","UT","VA","VI","VT",
"WA","WI","WV","WY"];

var x = d3.scaleBand()
    .domain(states.map(function(state){return state;}))
    .range([0,width])
    .paddingInner(0.2)
    .paddingOuter(0.2);


var xAxisCall = d3.axisBottom(x)
    .tickValues(states);
g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + height + ")")
    .call(xAxisCall)
.selectAll("text")
    .attr("y", "0")
    .attr("x", "-15")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)");

var y = d3.scaleLog()
    .base(10)
    .range([height,0])
    .domain([5000,150000000]);


var yAxisCall = d3.axisLeft(y)
    .tickFormat(function(d){return +d;})
    .tickFormat(d3.format(d))
g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);


var area = d3.scaleLinear()
    .domain([3,4])
    .range([25*Math.PI,50*Math.PI ]);
    

d3.json("data/dataBig.json").then((data) => {
    console.log(data);
    const formattedData = data.map(function(category){
        return category["charities"].filter(function(charity){
            // var ratingExists = (charity.currentRating.rating);
            charity.currentRating;
            // return ratingExists;
        }).map(function(charity,i){
        // console.log(category);
        // category.charities.map(function(charity,i){
            console.log(charity.category.categoryName);
            console.log(i);
            console.log(charity.currentRating.rating);
            charity.currentRating.rating = +charity.currentRating.rating;
            charity.irsClassification.incomeAmount = +charity.irsClassification.incomeAount;
            return charity;
        });
    });
    console.log("FORMATTED DATA LENGTH");
    console.log(formattedData.length);

    d3.interval(function(){
        categoryID = (categoryID < data.length) ? categoryID + 1 : 0; 
        console.log("DATALENGTH");
        console.log(data.length);
        update(formattedData[categoryID]);}, 1000);
        
        //before the 1 second wait, start at index 0 
        update(formattedData[0]);
    });

var ratingColor = d3.scaleOrdinal(d3.schemePastel1);

//each data input represents a big POJO with key categoryID, categoryName
function update(data){
    //Standard transition time for visualization
    
    
    
    // var y = d3.scaleLinear()
    //     .range([height,0])
    //     .domain([
    //         d3.min(data.charities, function(charity){
    //             return charity.irsClassification.incomeAmount;
    //         }),
    //         d3.max(data.charities, function(charity){
    //             return charity.irsClassification.incomeAmount;
    //         })
    //     ]);
    
    var t = d3.transition()
        .duration(1000); 



    //JOIN new data with old elements
    var circles = g.selectAll("circle").data(data, function(categoryObj){
        return categoryObj.mailingAddress.stateOrProvince; 
    });

    circles.exit()
        .attr("class", "exit")
        .remove();

    circles.enter()
        .append("circle")
        .attr("class", "enter")
        .attr("fill",function(charity){
            return ratingColor(charity.currentRating.rating);
        })
        .merge(circles)
        .transition(t)
            .attr("cy", function(charity){return y(charity.irsClassification.incomeAmount);})
            .attr("cx", function(charity){return x(charity.mailingAddress.stateOrProvince);})
            .attr("r", function(charity){return Math.sqrt(area(charity.currentRating.rating)/Math.PI)});

        

    //ENTER new elements present in new data
}    



//var x
//var y
//var area
//var ratingColor 
        
// //data.json has charity category ids and names 
// this works but it takes time for each api call to come back with data and update the array
// d3.json("data/data.json").then(function(data){
//     for(let i = 0; i < data.length; i++){
//         //for each charity cateogry, making a json call to get those charities under that category and storing the array under key (charities) for each corresponding cateogry.
//         d3.json(apiArray[i]).then(function(data2){
//             data[i].charities = data2; 
//             console.log(data2);
//             console.log(data[i]);
//         });
//     }
//     console.log(data);
// }).catch(error => console.log(error));


