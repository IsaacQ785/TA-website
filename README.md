This is a MVP template for a technical analysis website for trading. 

## Structure

### Versions
- Releases on Monday of each week, commencing 31/01/2022, with versions labelled as follows:

{UI version}.{month}.{week of month} = 0.1.1 -> 0.2.1 -> 0.2.2 ...
### Pages 

- contains each separate webpage

### graph functions 

- all files for the different functions used in TA. This is a work in progress, and new functions will be added to the dev branch, and merged into each new version week on week.

### Data intake

- contains .py files for data ingestion into database. MongoDB is used for document storage, yahoo finance as website where data is scraped from. This

### components

Includes any repeated components to be used throughout the website.

### lib

- Initialises a database connection onLoad of website. 

