---
title: Add a New Item to StatusPage
order: 3
layout: statuspage
left_nav_area_order: 1
area: Guides
ignored: true
---

<script type="text/javascript" src="/scripts/app/angular.js"></script>
<script type="text/javascript" src="/scripts/app/angular-route.js"></script>
<script type="text/javascript" src="scripts/app.js"></script>

<div class="alert alert-info alert-dismissible" role="alert">

  <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>

  <b>Prerequisites -</b> Service/Tool/Web Page registered in the <a href="https://uptime-ext.cf.hybris.com/dashboard/events">External Uptime</a>
</div>


### Manage StatusPage Components

<div ng-app="statusPage">
    <div ng-view></div>
</div>
