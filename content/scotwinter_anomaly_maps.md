Title: Scottish Winter Anomaly Maps
Date: 2017-12-05

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

## Getting a list of crags

We can use UKC's crag map to get a list of candidate Winter Crags, but we can't do the entirety of Scotland in one
request. The webpage limits the search radius to 150km and the number of results to 150,
so we need to make a series of requests to make sure we get all the crags. One straightforward way to do this is to make
one request per 100km Ordnance Survey Grid Square.


```python
import numpy as np
np.ogrid
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