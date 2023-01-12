function init() {
    var selector = d3.select("#selDataset");

    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // d3.json("data/samples.json").then((data) => {
        var sampleNames = data.names;

        console.log(data);

        sampleNames.forEach(sample => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        });
        
        // Display first sampleName from list to build initial plots
        var initialSample = sampleNames[0];

        buildMetadata(initialSample);
        buildCharts(initialSample);
    });
}

// Initialize the dashboard
init();

// Function to update metadata and charts when new sample selected
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
    d3.json("data/samples.json").then((data) => {
        var metadata = data.metadata;

        // FIlter the data for object with selected sample number
        var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var selectedSample = metadataArray[0];
        var PANEL = d3.select("#sample-metadata");

        PANEL.html("");

        Object.entries(selectedSample).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}: ${value}`);
        });
    });
}

// Create all charts
function buildCharts(sample) {
    d3.json("data/samples.json").then((data) => {
        var samples = data.samples;

        // FIlter the data for object with selected sample number
        var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
        // Filter the data for object with selected sample number (used to retrieve for wash frequency)
        var metadataArray = data.metadata.filter(sampleObj => sampleObj.id == sample);

        var selectedSample = sampleArray[0];

        var otu_ids = selectedSample.otu_ids;
        var otu_labels = selectedSample.otu_labels;
        var sample_values = selectedSample.sample_values;
        var wfreq = metadataArray[0].wfreq;

    // -------- BAR CHART -------------------------------------
        // Create y labels with "OTU" preceding otu_id (OTU 1167)
        var yticks = otu_ids.slice(0,10).map(outId => `OTU ${outId}`).reverse();

        var barData = [{
            x: sample_values.slice(0,10).reverse(),
            y: yticks,
            type: "bar",
            orientation: "h",
            text: otu_labels.slice(0,10),
        }];

        var barLayout = {
            title: "Top 10 OTUs per Sample"
        };

        Plotly.newPlot("bar", barData, barLayout);
    // -------- BAR CHART -------------------------------------

    // -------- GUAGE CHART -------------------------------------
        // Create y labels with "OTU" preceding otu_id (OTU 1167)
        var gaugeData = [{
            // domain: ,
            value: wfreq,
            title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week"},
            type: "indicator",
            mode: "gauge+number",
            gauge: {
                axis: { range: [null, 10], tickcolor: "darkblue" },
                bar: { color: "darkblue" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "gray",
            }
        }];

        Plotly.newPlot("gauge", gaugeData, {});
    // -------- GUAGE CHART -------------------------------------

    // -------- BUBBLE CHART -------------------------------------
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: { 
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            },
            text: otu_labels,
        }];

        var bubbleLayout = {
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1200
        }

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // -------- BUBBLE CHART -------------------------------------

    });
}