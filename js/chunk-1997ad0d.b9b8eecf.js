(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1997ad0d"],{"230c":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{},[a("el-card",{staticClass:"box-card filter-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("el-breadcrumb",{attrs:{separator:"/"}},[a("el-breadcrumb-item",{attrs:{to:{path:"/"}}},[t._v("首页")]),a("el-breadcrumb-item",[a("a",{attrs:{href:"/"}},[t._v("活动管理")])]),a("el-breadcrumb-item",[t._v("活动列表")]),a("el-breadcrumb-item",[t._v("活动详情")])],1)],1),a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:t.ruleForm,size:"mini"}},[a("el-form-item",{attrs:{label:"状态",prop:"resource"}},[a("el-radio-group",{model:{value:t.status,callback:function(e){t.status=e},expression:"status"}},[a("el-radio",{attrs:{label:null}},[t._v("全部")]),a("el-radio",{attrs:{label:0}},[t._v("草稿")]),a("el-radio",{attrs:{label:1}},[t._v("待审核")]),a("el-radio",{attrs:{label:2}},[t._v("通过审核")]),a("el-radio",{attrs:{label:3}},[t._v("审核失败")]),a("el-radio",{attrs:{label:4}},[t._v("已删除")])],1)],1),a("el-form-item",{attrs:{label:"频道"}},[a("el-select",{attrs:{placeholder:"请选择频道"},model:{value:t.channelId,callback:function(e){t.channelId=e},expression:"channelId"}},[a("el-option",{attrs:{label:"全部",value:t.channelId}}),t._l(t.channels,(function(t,e){return a("el-option",{key:e,attrs:{label:t.name,value:t.id}})}))],2)],1),a("el-form-item",{attrs:{label:"日期"}},[a("el-date-picker",{attrs:{type:"datetimerange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",format:"yyyy-MM-dd","value-format":"yyyy-MM-dd"},model:{value:t.rangeDate,callback:function(e){t.rangeDate=e},expression:"rangeDate"}})],1),a("el-form-item",[a("el-button",{attrs:{type:"primary",disabled:t.loading},on:{click:function(e){return t.loadArticle(t.status)}}},[t._v("查询")])],1)],1)],1),a("el-card",{staticClass:"box-card"},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("span",[t._v("根据筛选条件共才查询到 "),a("i",[t._v(t._s(t.totalCount))]),t._v(" 条结果：")])]),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:t.articles,border:"",stripe:"",size:"mini"}},[a("el-table-column",{attrs:{prop:"date",label:"封面"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-image",{staticStyle:{width:"100px",height:"100px"},attrs:{src:e.row.cover.images[0],fit:"cover",lazy:""}},[a("div",{staticClass:"image-slot",attrs:{slot:"placeholder"},slot:"placeholder"},[t._v(" 加载中"),a("span",{staticClass:"dot"},[t._v("...")])])])]}}])}),a("el-table-column",{staticClass:"table-title",attrs:{prop:"title",label:"标题"}}),a("el-table-column",{attrs:{prop:"status",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-tag",{attrs:{type:t.srticleStatus[e.row.status].type}},[t._v(t._s(t.srticleStatus[e.row.status].text))])]}}])}),a("el-table-column",{attrs:{prop:"pubdate",label:"发布时间"}}),a("el-table-column",{attrs:{prop:"date",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"primary",icon:"el-icon-edit",circle:""},on:{click:function(a){t.$router.push("/publish?id="+e.row.id.toString())}}}),a("el-button",{attrs:{type:"danger",icon:"el-icon-delete",circle:""},on:{click:function(a){return t.DeleteArticle(e.row.id)}}})]}}])})],1),a("el-pagination",{ref:"pageDom",attrs:{layout:"prev, pager, next",total:t.totalCount,"page-size":t.pageSize,disabled:t.loading,"current-page":t.page},on:{"current-change":t.currentChange,"update:currentPage":function(e){t.page=e},"update:current-page":function(e){t.page=e}}})],1)],1)},n=[],l=a("c24f"),i={name:"ArticleIndex",components:{},props:{},data:function(){return{ruleForm:{region:"",delivery:!1,type:[]},articles:[],totalCount:0,pageSize:10,status:null,channels:[],channelId:null,pageDom:null,rangeDate:null,loading:!0,page:1,srticleStatus:[{status:0,text:"草稿",type:"warning"},{status:1,text:"待审核",type:""},{status:2,text:"审核成功",type:"success"},{status:3,text:"审核失败",type:"danger"},{status:4,text:"已删除",type:"info"}]}},computed:{},watch:{},created:function(){this.getArticle(),this.getArticleChannels()},mounted:function(){},methods:{submitForm:function(t){this.$refs[t].validate((function(t){if(!t)return console.log("error submit!!"),!1;alert("submit!")}))},resetForm:function(t){this.$refs[t].resetFields()},getArticle:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;this.loading=!0,Object(l["c"])({page:e,per_page:this.pageSize,status:this.status,channel_id:this.channelId,begin_pubdate:this.rangeDate?this.rangeDate[0]:null,end_pubdate:this.rangeDate?this.rangeDate[1]:null}).then((function(e){var a=e.data.data,r=a.results,n=a.total_count;t.articles=r,t.totalCount=n,t.loading=!1}))},currentChange:function(t){console.log(t),this.getArticle(t)},loadArticle:function(t){this.getArticle()},getArticleChannels:function(){var t=this;Object(l["d"])().then((function(e){t.channels=e.data.data.channels}))},DeleteArticle:function(t){var e=this;this.$confirm("此操作将永久删除该文章, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning",center:!0}).then((function(){e.$message({type:"success",message:"删除成功!"}),Object(l["b"])(t),e.getArticle(e.page)})).catch((function(){e.$message({type:"info",message:"已取消删除"})}))}}},o=i,s=(a("7e1d"),a("2877")),c=Object(s["a"])(o,r,n,!1,null,"87c11064",null);e["default"]=c.exports},"7e1d":function(t,e,a){"use strict";a("d5d8")},c24f:function(t,e,a){"use strict";a.d(e,"f",(function(){return n})),a.d(e,"j",(function(){return l})),a.d(e,"c",(function(){return i})),a.d(e,"d",(function(){return o})),a.d(e,"b",(function(){return s})),a.d(e,"a",(function(){return c})),a.d(e,"e",(function(){return u})),a.d(e,"g",(function(){return d})),a.d(e,"h",(function(){return p})),a.d(e,"i",(function(){return m}));var r=a("b775"),n=function(t){return Object(r["a"])({method:"POST",url:"/mp/v1_0/authorizations",data:t})},l=function(){return Object(r["a"])({method:"GET",url:"/mp/v1_0/user/profile"})},i=function(t){return Object(r["a"])({method:"GET",url:"/mp/v1_0/articles",params:t})},o=function(){return Object(r["a"])({method:"GET",url:"/mp/v1_0/channels"})},s=function(t){return Object(r["a"])({method:"DELETE",url:"/mp/v1_0/articles/".concat(t)})},c=function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return Object(r["a"])({method:"POST",url:"/mp/v1_0/articles",param:{draft:e},data:t})},u=function(t){return Object(r["a"])({method:"GET",url:"/mp/v1_0/articles/".concat(t)})},d=function(t,e){var a=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return Object(r["a"])({method:"PUT",url:"/mp/v1_0/articles/".concat(t),param:{draft:a},data:e})},p=function(t){return Object(r["a"])({method:"PATCH",url:"/mp/v1_0/user/photo",data:t})},m=function(t){return Object(r["a"])({method:"PATCH",url:"/mp/v1_0/user/profile",data:t})}},d5d8:function(t,e,a){}}]);
//# sourceMappingURL=chunk-1997ad0d.b9b8eecf.js.map