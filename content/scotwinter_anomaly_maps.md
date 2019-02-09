Title: Scottish Winter Anomaly Maps
Date: 2017-12-05
Status: Draft

As I write this, the first major snows of the Winter have arrived at my home in the Peak District. Already this year I've
made the long pilgrimage to the Highlands of Scotland for the eagerly awaited first mixed climbs of the season; in contrast to last year
when the UK experienced its warmest December on record, and the Scottish crags were more suited to rock boots than crampons.
That year Winter failed to materialize at all, and discussion on the forums of UKClimbing turned to whether in fact it
had been the worst season ever for Scottish Winter Climbers. Definitive answers to similar favourite questions among Brits
such as, "Is this the wettest Summer on record?", can be found courtesy of the excellent Climate Anomaly Maps provided by
the MET Office. I decided to see if I could produce something similar for Scottish Winter Climbing activity.

## Getting the data

The MET Office's maps benefit from objective climate data courtesy of the historical records of hundreds of weather stations
across the UK. We have no equivalent for climbing activity, and short of camping out at the base of a crag and actually counting
the number of times it's climbed in a Winter season - not a pleasant prospect - we have to rely on public logbook data,
the most exhaustive source of which in the UK by some margin is UKClimbing.

UKC does not provide a public API for accessing its data, however the website and its URLs are structured in such a way
as to make scraping their HTML pages for data fairly straightforward. A logbook page has a URL of the following form : 
`/logbook/c.php?i=<climb_id>`, and a crag URL looks like `/logbook/crag.php?id=<crag_id>`. The `climb_id` can be extracted
from its parent crag page

In python-esque pseudo code, the process is roughly as follows:

```python
for crag in winter_crags():
    for climb in extract_winter_climbs(crag):
        extract_logbook(climb)
```

UKC Provides a crag search facility which returns crag ids based on location. A single request looks like
`/logbook/map/liveresults.php?g=1&loc=<latitude>%2C<longitude>&dist=<radius>&km=1&q=` 
(I determined this by performing a search and looking at the network traffic using Google Chrome's developer tools)

The result of this request is an html file that we can parse to get the information we need about that particular crag,
for example, here is the fragment that describes Ben Nevis

```html
<div class="panel panel-success" style="cursor:pointer"
     onclick="window.open('../crag.php?id=16877', 'crag16877')" onmouseover='showArrow(-5.004,56.797)'
     onmouseout='hideArrow()' title="Click for full details">
    <div class="panel-heading"><i class="icon-map-marker pull-right" title="Crag"></i>Ben Nevis</div>
    <div class="panel-body small">Highland, SCOTLAND<br/><span
            class="text-muted">384 climbs, Andesite</span><br/>39 km WNW
    </div>
</div>

```

Using the Python library BeautifulSoup, we can extract the information we need from the above fragment and turn it into
a Python dictionary representation that looks like this: 
```python
{16877: { 'name': 'Ben Nevis',
             'latitude': 56.797,
             'longitude': -5.004,
             'num_climbs': 384,
             'rock_type': 'Andesite',
             'region': 'Highland'
         }}
```

Attempting to get all the crags in Scotland using this method returns too many results, but we can perform
a series of requests in a grid pattern using Ordinance Survey National Grid coordinates and accumulate the results:


### A diversion into Asynchronous IO and Coroutines

For historical reasons I won't go into here (See this video if you're interested), Python is intrinsically sequential.
Most of the time this isn't really a problem, but in the case where a program is performing a lot of network requests - 
such as in web scraping - Python spends a lot of time waiting and not much time processing.

```python
def extract_log_for_crag(crag_id):
    session = Session()
    crag_url = ukc.create_crag_url(crag_id)
    crag_response = session.get(crag_url)

    crag_logs = []

    for climb_id, climb in ukc.climbs(BeautifulSoup(crag_response.text, 'lxml')):
        log_url = ukc.create_climb_log_url(climb_id)
        log_response = session.get(log_url)
        # execution will block here, waiting for the network request to return
        crag_logs += list(ukc.logbook(BeautifulSoup(log_response.text, "lxml")))

    return crag_logs
```

In the case of a 'crag' like [Ben Nevis](https://www.ukclimbing.com/logbook/crag.php?id=16877), 387 requests are required
to get the full log book, and that's just for one crag. There are X winter crags in Scotland - waiting for each of those
logbook requests to return adds up to a significant period of time during which the Python code isn't actually doing anything.


```python
async def extract_log_for_crag(crag_id):
    session = Session()
    crag_url = ukc.create_crag_url(crag_id)
    crag_response = session.get(crag_url)

    crag_logs = []

    for climb_id, climb in ukc.climbs(BeautifulSoup(crag_response.text, 'lxml')):
        log_url = ukc.create_climb_log_url(climb_id)
        log_response = session.get(log_url)
        # execution will block here, waiting for the network request to return
        crag_logs += list(ukc.logbook(BeautifulSoup(log_response.text, "lxml")))

    return crag_logs
```


### A brief diversion into Coordinate System conversions

This is a large subject, but it will come up several times during this post so it's worth covering, albeit briefly. When
working with map visualizations, at some point you will need to deal with the issue
of converting points located on the sphere, given in latitude and longitude, to those on the plane (or the screen). In the UK,
this typically means converting from latitude and longitude, to metres. There are thousands of ways of doing this depending on the
application, but in the UK the overwhelmingly popular option is to use the UK National Grid, developed by the Ordnance Survey.

For anyone particularly interested in how the Ordance Survey Grid works I recommend the OS's website and their publication,
but for this application it can be boiled down to one line of code, using the unix `cs2cs` utility,
which is provided as part of the `proj` package

```sh
$ cs2cs +init=epsg:4258 +to +init=epsg:27700
```

This particular conversion uses the 7 parameter Helmert transformation, which gives results accurate to about X metres,
which is fine for our purposes. For more accuracy you can use the full non-linear OSTN02 transform provided by Ordnance
Survey, which is accurate to less than a metre.