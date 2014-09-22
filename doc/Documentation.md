# Visual-overview Documentation #

The objective of visual-overview is, as its name says, to give a visual overview of public datasets. The project now is in an early stage and only works with CSV (comma separated values) format.

***
## Detecting a table ##

The main problem with csv format, is that a general standard does not exist. This causes the existence of CSV files which are hard to understand. Some CSV files have annotations before the table, and others after the table. Fortunately, given the simplicity of the CSV file format, this is almost the only problem. So the first objective is to detect where a table starts, and where its ends inside a CSV file.

First of all, let's give some terminology used on the project:

* **Header:** The header in a table is the name each column receives.
* **Annotations:** An annotation is any comment or text written before the table.
* **Footer:** A Footer is an annotations, but after the table.

So, in order to recognize a table, we must find the header and the footer. To find the header the following heuristics were used:

1. If the lenght of a row is less than a given number, then that row is not the header.
2. If half or more of a column inside a row are empty, then that row is not the header.

The reason for accepting empty columns, is because sometimes csv files comes with empty columns, and in that case, we still want to detect the table.

This heuristics will not only found the header. This heuristics are also valid for a table without headers, so it will specifically detect the beginning of a table. Given this, we can safely assume that the footer can be detected using the same heuristics, but applied at the end of the table.

After the detection of the beginning and end of a table, separating the annotations and the footer is straight-forward: we just split the csv in three, using the positions found with the heuristics as split possition.

***
## Different separators ##

A complication found while working on table detection, was that sometimes the CSV didn't used the comma as separator value. Sometimes it was a tab, semicolon, or "|". Given this, appeared the necesity to detect wich separator was being used before trying to recognize the table.

This task was resolved in a really simple way: The occurrences of each possible separator inside the CSV file are counted. The one wich appears the most, is considered as the CSV separator.

***

## Visualizations ##

Once we have the table, come the important part: the visualization of the data. This part is really hard because involves the humam factor. This means that the names of the columns can be written in many ways for the same data type, and a data type can have multiple representations.

The approach to solve this problem, was to have a data dictionary. In this dictionary each key is a way to name a data type, and each value is a "normalized" representation of the data type. So if I happen to find a data type name wich is not in the dictionary, I can manually add it later. While a data visualizations doesn't exist for a column, the column will be treated as "default" giving it (as its name says) a default visualization.

### General Algorithm to add a new Visualization ###

On progress...

(Note: I had the algorithm, and when I was writing it, I realized that is really hard to add a new visualization. I am now refactoring the code to simplify this task).

### Default Visualization ###

The default visualization is really simple. It's consist in a wordcloud and an histrogram.

### Maps Visualization ###

This was the first visualization supported by visual-overview. Using the google maps API and a location given by latitude and longitude columns, a map is displayed marking 200 random positions from the dataset. There's also and infoWindow on each marker, but for now, its only displaying plain information.

### Calendar Visualization ###

On progress...

***
## Using visual-overview ##

Visual overview now has two html files. One is called "index.html", wich corresponds to the previous version of visual-overview. This html receives a csv dataset URL in a text input and shows a visualization for each column assuming that it's well formed.

The second file is called "test.html" and it's the actual version of visual-overview. It still doesn't show any visualization. This html receives a csv dataset URL in a text input and the javascript console shows three arrays: One with annotations, one with the table, and one with the footer. The objective of this project now, is to offer visualizations for these three arrays.
