## Comparing Charities Over 50 State and Territories
### An interactive graph that depicts 11 categories of nonprofits across US states and territories. 

[Live Site](https://feiygh.github.io/JavaScriptProj/)
#### This projects uses D3.js library and JavaScript. I set state transitions to be one second. 

![Site picture](https://github.com/FeiYGH/JavaScriptProj/blob/master/ReadmeImages/Screen%20Shot%202020-05-24%20at%207.06.24%20PM.png)

## Features
1. Each charity to be represented by a circle, colored ordinally based upon charity category, where size is proportional to its income.
2. Data about all charities are gathered from API calls to Charity Navigator.
https://www.charitynavigator.org/index.cfm?bay=content.view&cpid=1397
3. Graph plays through data from all the states.
4. Set up a filter where user can selectively show one category or all categories of nonprofits.
5. I put in buttons "Play" and "Pause" to allow user to play and pause through the presentation. 
6. Set up a state slider allowing user to go to whatever state they want

## Code
### State transitions
State transitions are based upon D3.js steps of joining new data with old elements, exiting old elements that are not present in the data, and entering the new elements not present in new data. I set each state to be there for three seconds before graph shows the next state. I set the transition time to be 1 second. The axis are recalculated and changed to fit each state.

```javascript
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
```

### Circle sizes proportional to charity income amount
Circles sizes are represented by the charity income amount. I calculated the radius of the circle by solving for radius where area is the income amount. The attribute of radius is then set to that radius. 
```javascript
.transition(t)
            .attr("cy",function(d){return y(d.currentRating.financialRating.score)})
            .attr("cx", function(d){return x(d.currentRating.score)})
            .attr("r", function(d){return Math.sqrt(area(d.irsClassification.incomeAmount)/Math.PI);});
```

### Charity category filter
The filter is a select element on index.html with 12 different values that represent all to each category. In the JavaScript file, when changed (with an eventhandler), it calls the update function. The update function pulls the value from the select category and filter charities based upon that value.

```javascript
$("#category-select")
    .on("change", function(){
        update(formattedData[stateIndex], states[stateIndex]);
    });
    
 //update function
 function update(data, state){
    //adding a filter data array
    let category = $("#category-select").val();
   
    data = data.filter(function(d){
        if(category==="all"){
            return true;
        }else {
            return d.category.categoryName===category;
        }
    });
```

### Play, Pause, and Reset Buttons
"Play" and "Pause" are one button on index.html. When clicked, the button text is checked whether it is "play" or "pause." If "play", then the button's text is changed to "pause", and setInterval is called with interval set to 3 seconds and a function step is passed. "step" increments the index of which state and calls the update function again. If "pause", then the button's text is changed to "play" and function clearInterval is called to stop the loop.
"Reset" button is a button on index.html. In main.js, when clicked, it calls the update function with the stateIndex set back to 0.

```javascript
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

///for reset button
$("#reset-button")
    .on("click", function(){
        stateIndex = 0; 
        update(formattedData[stateIndex], states[0]);
    });

```
