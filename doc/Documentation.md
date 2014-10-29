# Visual-overview Documentation #

The objective of visual-overview is, as its name says, to give a visual overview of public datasets. The project now is in an early stage and only works with CSV (comma separated values) format.

***
## Detecting a table ##

The main problem with csv format, is that a general standard does not exist. This causes the existence of CSV files which are hard to understand. Some CSV files have annotations before the table, and others after the table. Fortunately, given the simplicity of the CSV file format, these are almost the only problems. So the first objective is to detect where a table starts, and where it ends inside a CSV file.

First of all, let's give some terminology used on the project:

* **Header:** The header in a table is the name each column receives.
* **Annotations:** An annotation is any comment or text written before the table.
* **Footer:** A Footer is an annotation, but after the table.

So, in order to recognize a table, we must find the header and the footer. To find the header the following heuristics were used:

1. If the lenght of a row is less than a given number, then that row is not the header.
2. If half or more of a column inside a row are empty, then that row is not the header.

The reason for accepting empty columns, is because sometimes csv files comes with empty columns, and in that case, we still want to detect the table. Besides, when we are generating the visualization, the empty columns are ignored.

This heuristics will not only found the header. This heuristics are also valid for a table without headers, so it will specifically detect the beginning of a table. Given this, we can safely assume that the footer can be detected using the same heuristics, but applied at the end of the table (unless there are a lot of empty columns in a given row, which can occur).

After the detection of the beginning and end of a table, separating the annotations and the footer is straight-forward: we just split the csv in three, using the positions found with the heuristics as split possition.

***
## Detecting separators ##

A complication found while working on table detection, was that sometimes the CSV didn't use the comma as separator value. Sometimes it was a tab, semicolon, or "|". Given this, appeared the necesity to detect wich separator was being used before trying to recognize the table.

This task was resolved in a really simple way: The occurrences of each possible separator inside the CSV file are counted. The one wich appears the most, is considered as the CSV separator.

***
## Creating new Visualizations ##

Once we have the table and the separator, comes the important part: the visualization of the data. This part is really hard because involves the humam factor. This means that the names of the columns can be written in many ways for the same data type, and a data type can have multiple representations.

The approach to solve this problem, was to have a data dictionary. In this dictionary each key is a way to name a data type, and each value is a "normalized" representation of the data type. So if I happen to find a data type name wich is not in the dictionary, I can manually add it later. While a data visualizations doesn't exist for a column, the column will be treated as "default" giving it (as its name says) a default visualization.

*Note: This approach will change, to something similar. It wont use a dictionary, but it will check every case individually, this is due to the possibility of the key being a substring of the column name*

### General Algorithm to add a new Visualization ###

The general steps are simple. The difficulty lies in creating the function that draws the new visualization.

1. Add the new visualization to the "determineColumnTypes" function in the *dataDict.js* file.
2. Once the visualization type is recognizable, create a new function to visualize a column in the *visualizations.js* file given the data, header, column types and the position of the column. For convention the function should be called "draw*Something*" where *Something* is any word used to differentiate this function.
3. If you need any helper function, create them right below your draw function.
4. Add the visualization to the visualization table (generally this is done right inside the draw function).

***
## Supported Visualizations (date: 29/10/2014) ##

### Wordcloud ###

The wordcloud is the default visualizations for non-numerical data.

### Box-plot ###

Box-plots are the default visualizations for numerical data.

### Histogram ###

A simple histogram that is shown for every column, default or not.

### Maps ###

First visualization supported by visual overview. It detects the presence of latitude longitude columns in the dataset and draws a google map showing up to 200 random locations from the dataset (200 because for big datasets, showing the entire datasets would be really slow).

### Calendar ###

Altough it name, the calendar visualizations doesn't shows a calendar. It shows a google annotation chart which shows how many times a date appeared in the dataset. Also, the dates are shown in chronological order.

***
## Using visual-overview ##

Visual overview now has two html files. One is called "index.html", wich corresponds to the first version of visual-overview. This html receives a csv dataset URL in a text input and shows a visualization for each column assuming (only wordcloud and histogram) that it's well formed.

The second file is called "test.html" and it's the actual version of visual-overview. It works in the same way that the first version. The difference is that the code is more robust: here there is no assumption of a well formed csv, it works with more visualizations, has error handling and has cors support.

***
## Bookmarklet ##

A simple bookmarklet has been developed for simplifying the url getting proccess. Instead of copying and pasting the url of a csv file in the visual-overview page, you can add the bookmark *Visualize it!*. When clicked it creates a div in the left-upper corner of the page with a miniature version of visual overview. There you cand drag and drop any url and click on visualize. A new visual-overview window will be opened with the visualization of the given url.



