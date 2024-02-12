const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
// use d3 to fetch data from JSON
d3.json(url).then(function(data){
    console.log(data);
}); 

// function populates the dropdown, bar chart, bubble chart, and demographics panel with each sample's dataset
function init(){
  // populate the dropdown list with samples' ids in the dataset by appending each ID as a new value
  let dropdown = d3.select("#selDataset");
  // use d3 to access sample data
  d3.json(url).then((data) => {
    // get the samples' ids from the names list in data 
    let ids = data.names;
    // append the ids of the samples to the dropdown list
    for (id of ids){
        dropdown.append("option").attr("value", id).text(id);
    };

  // call the fucntions to create bar graph, bubble chart, and demographics panel with selected sample's data or first sample's data on load
   createBarGraph(ids[0]);
   createBubbleGraph(ids[0]);
   createDemographicsPanel(ids[0]);
  }); 
};

// function populates the horizontal bar graph with selected sample's data
function createBarGraph(sample){
  // use d3 to access sample data
  d3.json(url).then((data) => {
    // get the data from sample list 
    let sample_values = data.samples;
    // filter sample for the selected sample id from the dropdown
    let selected_value = sample_values.filter(value => value.id == sample);
    // get the first ten otu_ids for the selected sample from the samples list and put them in reverse order
    let ids = selected_value[0].otu_ids.slice(0, 10).reverse();
    // get the first ten sample_values for the selected sample from the samples list and put them in reverse order
    let values = selected_value[0].sample_values.slice(0, 10).reverse();
    // get the first ten otu_labels for the selected sample from the samples list and put them in reverse order
    let names = selected_value[0].otu_labels.slice(0, 10).reverse();

    // create bar_trace setting the x values, y values, text showing labels, type of graph/chart, and orientation of graph/chart
    let bar_trace = {
      x: values,
      y: ids.map(item => `OTU ${item}`),
      text: names,
      type: 'bar',
      orientation: 'h'
    };

  // set title of graph/chart
  let layout = {title: "Top Ten OTUs"};

  // update the restyled plot's values in the corresponding div in index.html ("bar" tag)
  Plotly.newPlot("bar", [bar_trace], layout);
  }); 
};

// function populates the bubble chart with selected sample's data
function createBubbleGraph(sample){
  // get the data from sample list 
  d3.json(url).then((data) => {
    // get the data from sample list
    let sample_values = data.samples;
    // filter sample for the selected sample id from the dropdown
    let selected_value = sample_values.filter(value => value.id == sample);
    // get the otu_ids for the selected sample from the samples list and put them in reverse order
    let ids = selected_value[0].otu_ids.reverse();
    // get the sample_values for the selected sample from the samples list and put them in reverse order
    let values = selected_value[0].sample_values.reverse();
    // get the otu_labels for the selected sample from the samples list and put them in reverse order
    let names = selected_value[0].otu_labels.reverse();

    // create bubble_trace setting the x values, y values, text showing labels, mode, marker properties
    let bubble_trace = {
      x: ids,
      y: values,
      text: names,
      mode: 'markers',
      marker: {
        size: values,
        color: ids,
        colorscale: "Earth"              
      }
    };

    // set title of graph/chart, x-axis label, y-axis label
    let layout = {
      title: "Bacteria Count for each Sample ID",
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'}
    };
    // update the restyled plot's values in the corresponding div in index.html ("bubble" tag)
    Plotly.newPlot("bubble", [bubble_trace], layout); 
  });
};

// function populates the demographics panel with selected sample's data
function createDemographicsPanel(sample){
  // get the data from sample list 
  d3.json(url).then((data) => {
  /// get the data from metadata list
  let demographics = data.metadata;
  // filter sample for the selected sample id from the dropdown
  let selected_value = demographics.filter(value => value.id == sample);
  // set the text to a blank string to clear out previous entries in the demographic panel
  d3.select('#sample-metadata').text('');

  // get the key value pairs for the selected sample
  Object.entries(selected_value[0]).forEach(([key,value]) => {
      // append the new key-value pair to the demographic info html section
      d3.select('#sample-metadata').append('p').text(`${key}: ${value}`);
  });
  
  });
};

// function to be called when the dropdown detects a change (function name as defined in index.html)
function optionChanged(value){
  // call the fucntions to create bar graph, bubble chart, and demographics panel with selected sample's data
  createBarGraph(value);
  createBubbleGraph(value);
  createDemographicsPanel(value);
};

init();