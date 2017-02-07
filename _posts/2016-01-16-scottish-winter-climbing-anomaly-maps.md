---
layout: post
title: Scottish Winter Climbing Anomaly Maps
published: true
---

It's usually about this time of year that my Twitter feed fills with pictures of snow and ice, accompanied by the
`#scotwinter` tag; as mountain guides, local climbers and weekend warriors alike make their way to Scotland in the hope
of climbing a classic Gully route or Hard Mixed test piece. 'Chasing the Ephemeral', as Scottish Winter Climbing guru
Simon Richardson put it. Well this year, conditions have been rather less than just ephemeral. Apart from some early
flurries in late November, the conditions that make Scottish Winter Climbing some of the best in the world have been all
but absent. Rather more reliable than the conditions themselves are discussions of said conditions on [UKClimbing][UKC]
One such [thread](http://www.ukclimbing.com/forums/t.php?t=656490) asked the question of whether there was anything
unusual about the December just gone. Inspired by the Met Office's [Climate Anomaly
maps](http://www.metoffice.gov.uk/public/weather/climate-anomalies/#?tab=climateAnomalies) , I sought to answer this
question using code and a bit of data visualization.

Getting the Data
----------------

To start answering this question we need data on climbing activity in Scotland over previous Winters. Fortunately
UKClimbing provide this data in the form of their [logbooks](http://www.ukclimbing.com/logbook/), publically available
on their website. However, this data is only available in HTML form from their web frontend, and so a bit of work is
required to process it back into database form so we can work with it. This is called "Web Scraping", and is the same
technique used by price comparison websites. A web scraping library called
[BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/) is available for Python, which is my scripting language
of choice for tasks such as these. I have also used the data analysis library [Pandas](http://pandas.pydata.org/), which
among other things has useful tools for handling unstructured and missing data.

Web scraping requires examination of the HTML structure of the page to be processed, which can be
done using Web browser development tools such as those provided by Chrome. Tabular data is usually
quite easy to extract. The following function extracts all the logbook entries for
a particular climb on UKC:


{% highlight python %}
import pandas as pd
from bs4 import BeautifulSoup

def extract_log(html):
    soup = BeautifulSoup(html, 'html.parser')
    log_rows = soup.find(id='public_logbooks').find('tbody').find_all('tr', recursive=False)
    log = pd.DataFrame([[cell.text for cell in row.find_all('td', recursive=False)] for row in log_rows],
                       columns=['name','date','style','notes'])
    dates = pd.to_datetime(log['date'], errors='coerce')
    return log[dates.notnull()]
{% endhighlight %}

So we can get all the entries from, for example, [Fingers Ridge](http://www.ukclimbing.com/logbook/c.php?i=2361)
, with the following Python code

{% highlight python %}
import requests

request = requests.get('http://www.ukclimbing.com/logbook/c.php?i=2361')
extract_log(request.text)
{% endhighlight %}

And we get the following output


|   | name    | date        | style  | notes     |
|---|---------|-------------|--------| ----------|
| 0 | Alice   |  2016/11/30 | Lead   | wet       |
| 1 | Bob     |  2015/02/01 |        | cold      |
| 2 | Charlie |  2014/12/25 | 2nd    | miserable |
{:.table}

Fingers Ridge is just one of many climbs at the popular Cairngorm crag,
[Coire an t'Sneachda](http://www.ukclimbing.com/logbook/crag.php?id=25). A similar 
function allows us to scrape the UKC crag page for information about each climb.

{% highlight python %}
def extract_crag_climbs(crag_html):
    crag_soup = BeautifulSoup(crag_html, 'html.parser')
    rows = crag_soup.find_all('tr', class_='climb')
    columns=['index','climb','info','grade','ticks','climb_id']
    climbs = pd.DataFrame(
        [[cell.text for cell in row.find_all('td', recursive=False)]+[row["data-id"]] for row in rows],
        columns=columns)
    winter_grades = ('I ','II ','III ','IV ','V ','VI ','VII ','VIII ','IX ','X ','XI ','XII ')
    climbs = climbs[climbs['grade'].str.startswith(winter_grades)]
    return climbs.set_index('climb_id').drop(['index'],axis=1)
{% endhighlight %}

Which gives us a table like this:


| climb_id | climb             | info  | grade     | ticks  | 
|----------|-------------------|-------|-----------|--------|
|  2361    | Fingers Ridge     | -     | IV 4 ***  | 665    |
|  2362    | Red Gully         | -     | II **     | 154    |
|  2363    | Goat Track Gully  | -     | II *      | 6      |
{:.table}

Given a list of crags, using these methods we can concatenate all the logs together, producing a table giving the logged
climbs on each crag by date.

| date           | 8257 | 623 | 715 |305 | 
|----------------|----|----|-----|------|
|  2016-02-01    | 11 | 127 | 14 | 0
|  2016-02-02    | 1 | 0 | 0 | 0
|  2016-02-03    | 42 | 99 | 0 |87 
{:.table}


Data Analysis
-------------

As a starting point, we can look at the histogram of climbs logged by day of the week.
Using the Pandas [TimeSeries](http://pandas.pydata.org/pandas-docs/stable/timeseries.html) methods, given
the logged climbs by date we can easily get daily totals for a particular crag. 

{% highlight python %}
logged_climbs_in_sneachda = climbs_by_date[25]
[logged_climbs_in_sneachda[climbs_by_date.index.dayofweek == i] for i in range(7)]

Out: [1042, 997, 858, 1011, 1031, 2671, 2236]
{% endhighlight %}


I've used the [d3](https://d3js.org/) library for JavaScript to generate the data visualizations.

{% svg chart 1200 900 %}

### Sampling Bias

What we're interested in knowing is how Winter Climbing activity deviates from the average by month, and by season.
As it stands, however, the UKC data has an inbuild sampling bias. Changes in the number of climbs logged on UKC could
be caused by a number of factors, including but not limited to

* Variation in weather conditions meaning a route is not suitable for climbing
* Changes in the number of users of UKC
* Changes in the proportion of UKC users who make active use of the logbooks

As we're only interested in the first of these, we need to make some effort to remove the influence of the others.
It is reasonable to assume that normal rock climbs, that is those that can be climbed year round, are not so susceptible
to changes in the weather. This is particularly true of the gritstone outcrops of the Peak District, that are climbed 
all year round and come into condition quickly after periods of poor weather. It is no coincidence that these are also
some of the most popular climbs in the country, and so courtesy of the 
[Law of Large Numbers](https://en.wikipedia.org/wiki/Law_of_large_numbers) are good candidates
for statistical analysis.

Creating the Maps
-----------------

For creating the maps I'm using the Shapefiles available from Natural Earth. 

## Extracting the shapefiles

For drawing the maps we want two shapefiles, one vector format for drawing the geographic ouline of Scotland
and its constituent islands, and one raster format for showing the topography.

## Coordinate Transformation

The Natural Earth shapefiles are provided in WGS84 Latitude and Longitude coordinates, typical of a GPS or Google Earth.
However if we plot these coordinates directly, we get a rather squashed image - the result of trying to plot a spherical
surface onto a flat screen. This is a problem in cartography that goes back hundreds of years, and the solution we use
has not changed much since the one proposed by [Gerardus Mercator](https://en.wikipedia.org/wiki/Mercator_projection) in
1569. The UK has its own 
[coordinate system](https://www.ordnancesurvey.co.uk/resources/maps-and-geographic-resources/the-national-grid.html) developed by
the Ordnance Survey, based on the Mercator Projection but with an additional local transformation. There's no easy way
to convert WGS84 coordinates to OS National Grid from within Python (although the GeographicLib does...), but the OS
provide an online utility.

### Transforming the vector file

### Transforming the raster file

Transforming the raster file is rather more complex as it is defined in terms of pixels rather than WGS84 coordinates.

## Colourization


[UKC] : https://www.ukclimbing.com
