Title: Winter Climbing Anomaly Maps
Script: winter.js

<style>

.landmass {
  fill: #ddd;
}

.states {
  fill: none;
  stroke: #fff;
  stroke-linejoin: round;
}

.hexagon {
  fill: steelblue;
  stroke: black;
  stroke-width: 1000;
}

</style>
<div class="row">
<div class="col">

<div class="dropdown">
  <button class="btn btn-info dropdown-toggle" 
  type="button" id="dropdownMenuButton" data-toggle="dropdown" 
  aria-haspopup="true" aria-expanded="false">Winter Season
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">2017/18</a>
    <a class="dropdown-item" href="#">2016/17</a>
    <a class="dropdown-item" href="#">2015/16</a>
    <a class="dropdown-item" href="#">2014/15</a>
    <a class="dropdown-item" href="#">2013/14</a>
    <a class="dropdown-item" href="#">2012/13</a>
    <a class="dropdown-item" href="#">2011/12</a>
    <a class="dropdown-item" href="#">2010/11</a>
    <a class="dropdown-item" href="#">2009/10</a>
    <a class="dropdown-item" href="#">2008/09</a>
    <a class="dropdown-item" href="#">2007/08</a>
  </div>
</div>

<div class="col">

<div class="dropdown">
</div>

</div>
<div>
<div class="row">
<div class="col" id="map_1"></div>
<div class="col" id="map_2"></div>
</div>
