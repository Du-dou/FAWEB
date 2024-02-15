
const base={
  baseURL:"https://www.lawknows.com/",
  // baseURL:"https://119.3.231.128",

  result:"/api/article/pageList",
  aggreateEffeclevel:"/api/sysDictData/rest/effecLevel/list",
  aggreateTimeliness:"/api/sysDictData/rest/timeLiness/list",
  aggreatePublishOffice:"/api/sysDictData/rest/pulishOffice/list",
  latestURL:"/api/article/rest/publishDateTimeList",    //最近发布
  effectiveURL:"/api/article/rest/implementDateList", //近期生效
  detail:"/api/article/rest/detail",
  advertise_detailpage:"/api/adver/rest/list",
  tree_publishoffice:"/api/sysDictData/rest/list/PulishOffice",
  catalog_effecLevel:"/api/sysDictData/rest/list/EffecLevel",
  catalog_timeliness:"/api/sysDictData/rest/list/TimeLiness",
  catalog_publishOffice:"/api/sysDictData/rest/list/PulishOffice",

  hierarchy_military:"/api/sysDictData/rest/list/hierarchy_military",
  category_policy:"/api/sysDictData/rest/list/category_policy",
  category_industry_groups:"/api/sysDictData/rest/list/category_industry_groups",
  hierarchy_party_law:"/api/sysDictData/rest/list/hierarchy_party_law",
}

export default base;
