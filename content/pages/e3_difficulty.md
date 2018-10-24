Title: Distribution of E3 Difficulty in the UK
Script: e3_difficulty.js

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
  type="button" id="uk_1_dropdown" data-toggle="dropdown" 
  aria-haspopup="true" aria-expanded="false">E3 Difficulty
  <span id="uk_1_label" class="badge badge-secondary">5a</span>
  
  </button>
  <div class="dropdown-menu" aria-labelledby="map_1_dropdown">
    <a class="dropdown-item" href="#">All</a>
    <a class="dropdown-item" href="#">5a</a>
    <a class="dropdown-item" href="#">5b</a>
    <a class="dropdown-item" href="#">5c</a>
    <a class="dropdown-item" href="#">6a</a>
    <a class="dropdown-item" href="#">6b</a>
    <a class="dropdown-item" href="#">6c</a>
  </div>
</div>
</div>
<div class="col">

<div class="dropdown">
  <button class="btn btn-info dropdown-toggle" 
  type="button" id="uk_2_dropdown" data-toggle="dropdown" 
  aria-haspopup="true" aria-expanded="false">E3 Difficulty
  <span id="uk_2_label" class="badge badge-secondary">5a</span>
  </button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a class="dropdown-item" href="#">All</a>
    <a class="dropdown-item" href="#">5a</a>
    <a class="dropdown-item" href="#">5b</a>
    <a class="dropdown-item" href="#">5c</a>
    <a class="dropdown-item" href="#">6a</a>
    <a class="dropdown-item" href="#">6b</a>
    <a class="dropdown-item" href="#">6c</a>
  </div>
</div>

</div>
<div>
<div class="row">
<div class="col" id="map_1"></div>
<div class="col" id="map_2"></div>
</div>
