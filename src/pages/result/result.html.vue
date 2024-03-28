<template>
  <div class="container"
       v-loading.fullscreen="loading"
       element-loading-text="努力加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.1)"
  >
    <div class="header_wraper">
      <m-header
        :isShow="showInput"
        @loginClick="login"
        @registerClick="register"
        :searchContent="current_status.keyword"
        @searchHandle="searchFromHeader"
        @searchOnInput="searchOnInput"
        ref="header"
      ></m-header>
    </div>
    <div class="content">
      <div class="search_resource" v-if="current_status.keyword !== ' '">
        <span>资源类型：</span>
        <span :class="{ active: current_status.search_resource === index }" v-for="(item, index) in search_resource"
              :key="index" @click="searchFromSeachResource(item.index)">{{ item.text }}</span>
      </div>
      <div class="search_fw" v-if="current_status.keyword !== ' '">
        <span>搜索范围：</span>
        <span :class="{ active: current_status.search_field === index }" v-for="(item, index) in search_field"
              :key="index" @click="searchFromSearchField(item.index)">{{ item.text }}</span>
      </div>
      <div class="key_word_w" v-if="resultList">
        <div class="key_word_list">
          <div class="key_word_title">搜索条件：</div>
          <div class="key_wor_item">
            <!--            <ul v-for="(item, index) in this.keyWordList" :key="item.id">-->
            <!--              <template v-if="item.dictLabel != null">-->
            <!--                <li>-->
            <!--                  <span v-if="item.dictType == 'keyWordSelf'">关键词：</span>-->
            <!--                  <span v-if="item.dictType == 'EffecLevel'">效力级别：</span>-->
            <!--                  <span v-if="item.dictType == 'TimeLiness'">时效性：</span>-->
            <!--                  <span v-if="item.dictType == 'PulishOffice'">发布机关：</span>-->
            <!--                  <span>{{ item.dictLabel }}</span>-->
            <!--                  <img-->
            <!--                    v-if="item.dictType!='keyWordSelf'"-->
            <!--                    src="@/static/del.png"-->
            <!--                    @click="deleKeywords(index, item)"-->
            <!--                  />-->
            <!--                </li>-->
            <!--              </template>-->
            <!--            </ul>-->
            <ul>
              <li v-if="this.current_status.keyword !== ''">关键词 ： {{ this.current_status.keyword }}
              </li>
              <li v-if="this.current_status.effecLevel_tree.code !== ''">效力级别 ：
                {{ this.current_status.effecLevel_tree.name.split('（')[0] }}
                <img src="@/static/del.png" @click="onDeleteTreeItem('效力级别')"/>
              </li>
              <li v-if="this.current_status.timeliness_tree.code !== ''">时效性 ：
                {{ this.current_status.timeliness_tree.name.split('（')[0] }}
                <img src="@/static/del.png" @click="onDeleteTreeItem('时效性')"/>
              </li>
              <li v-if="this.current_status.publishOffice_tree.code !== ''">发布机关 ：
                {{ this.current_status.publishOffice_tree.name.split('（')[0] }}
                <img src="@/static/del.png" @click="onDeleteTreeItem('发布机关')"/>
              </li>
            </ul>
          </div>
        </div>
        <div class="total_result">
          共找到<span>
<!--          {{!!searchContent ? resultList.currentTotalElements || 0 : 0 }}-->
          {{ result_count }}
        </span
        >个结果
        </div>
      </div>
    </div>
    <!-- 搜结果 -->
    <!--    <div class="no_reslut_all"-->
    <!--      v-if="resultList.length===0 && resultList" >-->
    <!--      抱歉，没有相关的搜索结果，请输入其它关键词-->
    <!--    </div>-->

    <!--    <div class="result_wraper" v-if="resultList && resultList.length > 0">-->
    <div class="result_wraper">
      <div class="result_content">
        <div class="result_left">
          <!--          左侧使用聚合-->
          <!--          <div class="left_tree_wraper_a" v-if="left_type===1">-->
          <!--            <div class="left_tree_wraper">-->
          <!--              <h3 class="tree_title">效力位阶</h3>-->
          <!--              <div class="left_tree" v-if="leftList_effeclevl.length>0">-->
          <!--                <el-tree v-loading="loading_effeclevel" class="tree_item" :data="leftList_effeclevl" :props="defaultProps"-->
          <!--                         @node-click="handleNodeClick"></el-tree>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="left_tree_wraper">-->
          <!--              <h3 class="tree_title">时效性</h3>-->
          <!--              <div class="left_tree" v-if="leftList_timeliness.length>0">-->
          <!--                <el-tree v-loading="loading_timeliness" class="tree_item" :data="leftList_timeliness" :props="defaultProps"-->
          <!--                         @node-click="handleNodeClick"></el-tree>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--            <div class="left_tree_wraper">-->
          <!--              <h3 class="tree_title">发布机关</h3>-->
          <!--              <div class="left_tree" v-if="leftList_publishoffice.length>0">-->
          <!--                <el-tree v-loading="loading_publishoffice" class="tree_item" :data="leftList_publishoffice" :props="defaultProps"-->
          <!--                         @node-click="handleNodeClick"></el-tree>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </div>-->
          <div class="left_tree_wraper_b" v-if="left_type===1">
            <div v-show="current_status.search_resource === 0">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">效力位阶</h3>
                <el-tree v-loading="loading_effeclevel" class="tree_catalog" :data="leftList_effeclevl"
                         :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 1">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">效力位阶</h3>
                <el-tree v-loading="loading_effeclevel" class="tree_catalog" :data="leftList_effeclevl"
                         :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 2">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">效力位阶</h3>
                <el-tree v-loading="loading_effeclevel" class="tree_catalog" :data="leftList_effeclevl"
                         :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 3">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">类别</h3>
                <el-tree v-loading="loading_effeclevel" class="tree_catalog" :data="leftList_effeclevl"
                         :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 5">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">类别</h3>
                <el-tree v-loading="loading_effeclevel" class="tree_catalog" :data="leftList_effeclevl"
                         :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
              </div>
            </div>

            <div class="tree_catalog_wraper">
              <h3 class="tree_title">时效性</h3>
              <el-tree v-loading="loading_timeliness" class="tree_catalog" :data="leftList_timeliness"
                       :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="tree_catalog_wraper">
              <h3 class="tree_title">发布机关</h3>
              <el-tree v-loading="loading_publishoffice" class="tree_catalog" :data="leftList_publishoffice"
                       :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
          <!--          左侧使用目录-->
          <div class="left_tree_wraper_b" v-else>
            <div v-show="current_status.search_resource === 0">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">效力位阶</h3>
                <el-tree class="tree_catalog" :props="props" :load="loadNode_effecLevl" lazy
                         @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 1">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">效力位阶</h3>
                <el-tree class="tree_catalog" :props="props" :load="loadNode_hierarchy_party_law" lazy
                         @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 2">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">效力位阶</h3>
                <el-tree class="tree_catalog" :props="props" :load="loadNode_hierarchy_military" lazy
                         @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 3">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">类别</h3>
                <el-tree class="tree_catalog" :props="props" :load="loadNode_category_policy" lazy
                         @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div v-show="current_status.search_resource === 5">
              <div class="tree_catalog_wraper">
                <h3 class="tree_title">类别</h3>
                <el-tree class="tree_catalog" :props="props" :load="loadNode_category_industry_groups" lazy
                         @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div class="tree_catalog_wraper">
              <h3 class="tree_title">时效性</h3>
              <el-tree class="tree_catalog" :props="props" :load="loadNode_timeliness" lazy
                       @node-click="handleNodeClick"></el-tree>
            </div>
            <div class="tree_catalog_wraper">
              <h3 class="tree_title">发布机关</h3>
              <el-tree class="tree_catalog" :props="props" :load="loadNode_publishOffice" lazy
                       @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
        </div>
        <div class="result_middle">
          <div class="result_list" v-if="resultList && resultList.length > 0">
            <div class="sort_types">
              <span>排序：</span>
              <span :class="{ active: current_status.sort_field === 'publish_date_time' }">
            发布日期
            <span class="arrow-wrap">
              <i class="arrow-top"
                 :class="{active:current_status.sort_field === 'publish_date_time' && current_status.sort_direction === 'asc'}"
                 @click="onSortClick('publish_date_time','asc')"></i>
              <i class="arrow-bottom"
                 :class="{active:current_status.sort_field === 'publish_date_time' && current_status.sort_direction === 'desc'}"
                 @click="onSortClick('publish_date_time','desc')"></i>
            </span>
          </span>
              <span :class="{ active: current_status.sort_field === 'implement_date'  }">
            实施日期
            <span class="arrow-wrap">
              <i class="arrow-top"
                 :class="{active:current_status.sort_field === 'implement_date' && current_status.sort_direction === 'asc'}"
                 @click="onSortClick('implement_date','asc')"></i>
              <i class="arrow-bottom"
                 :class="{active:current_status.sort_field === 'implement_date' && current_status.sort_direction === 'desc'}"
                 @click="onSortClick('implement_date','desc')"></i>
            </span>
          </span>
              <!--            暂时不需要相关性排序-->
              <!--            <span class="relativity" :class="{ active: orderBy == '' }" v-if="this.searchContent != ' '">-->
              <!--              相关性-->
              <!--              <span class="arrow-wrap">-->
              <!--                &lt;!&ndash; <i class="arrow-个top" :class="{active:direction == 'asc'&&orderBy == ''}" @click="orderClick('','asc')"></i> &ndash;&gt;-->
              <!--                <i class="arrow-bottom" :class="{active:direction == 'desc'&&orderBy == ''}" @click="orderClick('','desc')"></i>-->
              <!--              </span>-->
              <!--            </span>-->

            </div>
            <ul v-if="this.current_status.search_field === 0 ">
              <li
                class="result_item"
                v-for="(item, index) in resultList"
                :key="index"
              >
                <div class="title_wraper">
                  <div class="title_con">
                    <div><span @click="goDetail(item)" v-html="item.articleTitle"></span><span style="color: #007dc5"
                                                                                               v-if="item.articleVersion">（<span
                      v-html="item.articleVersion"></span>）</span></div>
                    <!--中文跳英文，目前用不了-->
                    <!--                    <a-->
                    <!--                      @click.stop-->
                    <!--                      target="_blank"-->
                    <!--                      :href="'/detail/' + item.statuteInfo.statuteEnglishArticleId"-->
                    <!--                      v-if="-->
                    <!--                        item.statuteInfo &&-->
                    <!--                        item.statuteInfo.statuteEnglishArticleId-->
                    <!--                      "-->
                    <!--                      style="text-decoration: none; margin-left: 10px"-->
                    <!--                      >English</a-->
                    <!--                    >-->
                  </div>


                  <div class="collection_wraper">
                    <!--                    暂时不需要点赞的显示-->
                    <!--                    <i class="iconfont icon-favorites" v-if="!item.isPraise" @click1.stop="praiseArticle(item)"></i>-->
                    <!--                    <i class="iconfont icon-favorites-fill" v-if="item.isPraise" @click1.stop="canclePraise(item)"></i>-->
                    <!--                    <span>{{item.praiseNum}}</span>-->
                    <span class="line"></span>
                    <i class="iconfont icon-favorite" v-if="!item.isCollect" @click1.stop="collect(item)"></i>
                    <i class="iconfont icon-favorite-fill" v-if="item.isCollect" @click1.stop="collect(item)"></i>
                    <!-- <img
                      src="@/static/collect.png"
                      v-if="item.isCollect"
                      @click.stop="collect(item)"
                    />
                    <img
                      src="@/static/uncollect.png"
                      v-if="!item.isCollect"
                      @click.stop="collect(item)"
                    /> -->
                    <span>{{ item.collectNum }}</span>
                  </div>
                </div>
                <div class="new-status-name blue" v-if="item.editDiscardDecide == 1">
                  关于修改、废止的决定
                </div>
                <div class="new-status-name blue" v-else-if="item.statuteInfo.effectLevelId == 'A0203'">
                  重要决定
                </div>
                <div
                  v-else-if="item.statuteInfo.timeLinessName"
                  class="new-status-name"
                  :class="{
                    'no-effect': item.statuteInfo.timeLinessName == '已修改'||item.statuteInfo.timeLinessName == '未生效',
                    'lose-effect': item.statuteInfo.timeLinessName == '失效',
                  }"
                >
                  {{ item.statuteInfo.timeLinessName }}
                </div>
                <div class="new-title-desc">
                  <div class="new-title-desc-left">
                    <div v-if="item.statuteInfo.publishDateTime">
                      发布日期：{{ item.statuteInfo.publishDateTime }}
                    </div>
                    <div v-if="item.statuteInfo.implementDate">
                      实施日期：{{ item.statuteInfo.implementDate }}
                    </div>
                    <div v-if="item.statuteInfo.publishOfficeName">
                      发布部门：{{ item.statuteInfo.publishOfficeName }}
                    </div>
                    <div v-if="item.statuteInfo.publishNum">
                      发文字号：{{ item.statuteInfo.publishNum }}
                    </div>
                  </div>
                </div>
                <!-- 修订信息 标题检索 -->
                <div class="result_main_content" v-if="item.lgfList">
                  <div>
                    <div class="result_content_desc">
                      <!--                    <div class="result_content_desc" @click="goDetail(item)">-->
                      <div
                        class="result_content_desc_item"
                        v-for="(lgf, index) in item.lgfList"
                        :key="index"
                      >
                        <span class="icon"></span>
                        <span>{{ lgf }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="this.current_status.search_field === 2 ">
              <li
                class="result_item"
                v-for="(item, index) in resultList"
                :key="index"
              >
                <div class="title_wraper">
                  <div class="title_con">
                    <div><span @click="goDetail(item)" v-html="item.articleTitle"></span><span style="color: #007dc5"
                                                                                               v-if="item.articleVersion">（<span
                      v-html="item.articleVersion"></span>）</span></div>
                    <!--中文跳英文，目前用不了-->
                    <!--                    <a-->
                    <!--                      @click.stop-->
                    <!--                      target="_blank"-->
                    <!--                      :href="'/detail/' + item.statuteInfo.statuteEnglishArticleId"-->
                    <!--                      v-if="-->
                    <!--                        item.statuteInfo &&-->
                    <!--                        item.statuteInfo.statuteEnglishArticleId-->
                    <!--                      "-->
                    <!--                      style="text-decoration: none; margin-left: 10px"-->
                    <!--                      >English</a-->
                    <!--                    >-->
                  </div>


                  <div class="collection_wraper">
                    <!--                    暂时不需要点赞的显示-->
                    <!--                    <i class="iconfont icon-favorites" v-if="!item.isPraise" @click1.stop="praiseArticle(item)"></i>-->
                    <!--                    <i class="iconfont icon-favorites-fill" v-if="item.isPraise" @click1.stop="canclePraise(item)"></i>-->
                    <!--                    <span>{{item.praiseNum}}</span>-->
                    <span class="line"></span>
                    <i class="iconfont icon-favorite" v-if="!item.isCollect" @click1.stop="collect(item)"></i>
                    <i class="iconfont icon-favorite-fill" v-if="item.isCollect" @click1.stop="collect(item)"></i>
                    <!-- <img
                      src="@/static/collect.png"
                      v-if="item.isCollect"
                      @click.stop="collect(item)"
                    />
                    <img
                      src="@/static/uncollect.png"
                      v-if="!item.isCollect"
                      @click.stop="collect(item)"
                    /> -->
                    <span>{{ item.collectNum }}</span>
                  </div>
                </div>
                <div class="new-status-name blue" v-if="item.editDiscardDecide == 1">
                  关于修改、废止的决定
                </div>
                <div class="new-status-name blue" v-else-if="item.statuteInfo.effectLevelId == 'A0203'">
                  重要决定
                </div>
                <div
                  v-else-if="item.statuteInfo.timeLinessName"
                  class="new-status-name"
                  :class="{
                    'no-effect': item.statuteInfo.timeLinessName == '已修改'||item.statuteInfo.timeLinessName == '未生效',
                    'lose-effect': item.statuteInfo.timeLinessName == '失效',
                  }"
                >
                  {{ item.statuteInfo.timeLinessName }}
                </div>
                <div class="new-title-desc">
                  <div class="new-title-desc-left">
                    <div v-if="item.statuteInfo.publishDateTime">
                      发布日期：{{ item.statuteInfo.publishDateTime }}
                    </div>
                    <div v-if="item.statuteInfo.implementDate">
                      实施日期：{{ item.statuteInfo.implementDate }}
                    </div>
                    <div v-if="item.statuteInfo.publishOfficeName">
                      发布部门：{{ item.statuteInfo.publishOfficeName }}
                    </div>
                    <div v-if="item.statuteInfo.publishNum">
                      发文字号：{{ item.statuteInfo.publishNum }}
                    </div>
                  </div>
                </div>
                <!-- 修订信息 标题检索 -->
                <div class="result_main_content" v-if="item.lgfList">
                  <div>
                    <div class="result_content_desc">
                      <!--                    <div class="result_content_desc" @click="goDetail(item)">-->
                      <div
                        class="result_content_desc_item"
                        v-for="(lgf, index) in item.lgfList"
                        :key="index"
                      >
                        <span class="icon"></span>
                        <span>{{ lgf }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <ul v-if="this.current_status.search_field === 1">
              <li
                class="result_item result_item_title"
                v-for="(item, index) in resultList"
                :key="index"
              >
                <div class="title_wraper">
                  <div
                    class="title_con"
                  >
                    <div><span @click="goDetail(item)" v-html="item.articleTitle"></span></div>
                    <a
                      @click.stop
                      target="_blank"
                      :href="
                        `/${item.statuteInfo.statuteEnglishArticleId}.html`
                      "
                      v-if="
                        item.statuteInfo &&
                        item.statuteInfo.statuteEnglishArticleId
                      "
                      style="text-decoration: none; margin-left: 10px"
                    >English</a
                    >
                  </div>
                  <div class="collection_wraper">
                    <!--                    暂时不要点赞-->
                    <!--                    <i class="iconfont icon-favorites" v-if="!item.isPraise" @click1.stop="praiseArticle(item)"></i>-->
                    <!--                    <i class="iconfont icon-favorites-fill" v-if="item.isPraise" @click1.stop="canclePraise(item)"></i>-->
                    <!--                    <span>{{item.praiseNum}}</span>-->
                    <span class="line"></span>
                    <i class="iconfont icon-favorite" v-if="!item.isCollect" @click1.stop="collect(item)"></i>
                    <i class="iconfont icon-favorite-fill" v-if="item.isCollect" @click1.stop="collect(item)"></i>
                    <!-- <img
                      src="@/static/collect.png"
                      v-if="item.isCollect"
                      @click.stop="collect(item)"
                    />
                    <img
                      src="@/static/uncollect.png"
                      v-if="!item.isCollect"
                      @click.stop="collect(item)"
                    /> -->
                    <span>{{ item.collectNum }}</span>
                  </div>
                </div>
                <div
                  v-if="item.editDiscardDecide == 1"
                  class="new-status-name blue"
                >
                  关于修改、废止的决定
                </div>
                <div
                  v-else-if="item.statuteInfo.effectLevelId == 'A0203'"
                  class="new-status-name blue"
                >
                  重要决定
                </div>
                <div
                  v-else-if="item.statuteInfo.timeLinessName"
                  class="new-status-name"
                  :class="{
                    'no-effect': item.statuteInfo.timeLinessName == '未生效'||item.statuteInfo.timeLinessName == '已修改',
                    'lose-effect': item.statuteInfo.timeLinessName == '失效',
                  }"
                >
                  {{ item.statuteInfo.timeLinessName }}
                </div>
                <div class="new-title-desc">
                  <div class="new-title-desc-left">
                    <div v-if="item.statuteInfo.publishDateTime">
                      发布日期：{{ item.statuteInfo.publishDateTime }}
                    </div>
                    <div v-if="item.statuteInfo.implementDate">
                      实施日期：{{ item.statuteInfo.implementDate }}
                    </div>
                    <div v-if="item.statuteInfo.publishOfficeName">
                      发布部门：{{ item.statuteInfo.publishOfficeName }}
                    </div>
                    <div v-if="item.statuteInfo.publishNum">
                      发文字号：{{ item.statuteInfo.publishNum }}
                    </div>
                  </div>
                </div>
                <div class="result_main_content" v-if="current_status.keyword !== ''">
                  <div>
                    <div class="result_content_desc" @click="goDetail(item)">
                      <div
                        class="result_content_desc_item"
                        v-for="(itemChild, index) in item.currentList"
                        :key="index"
                      >
                        <span class="icon"></span>
                        <span v-html="itemChild"></span>
                      </div>
                    </div>
                  </div>
                  <div class="count">
                    <div class="count_number">
                      <div>
                        命中<span>{{ item.hitTimes }}</span
                      >次
                      </div>
                      <div class="pagation_W">
                        <span
                        >{{ item.currentTabIndex }}/{{
                            item.allTabIndex
                          }}</span
                        >
                        <span @click.stop="prev(item)" :class="item.currentTabIndex == 1 ? 'disabled':''">前一页</span>
                        <span @click.stop="next(item)"
                              :class="item.currentTabIndex == item.allTabIndex ? 'disabled':''">后一页</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="result_pagination">
              <el-pagination
                background
                @current-change="handleCurrentChange"
                layout="prev, pager, next"
                :current-page="current_status.page_num"
                :page-size="10"
                :total="result_count_show">
              </el-pagination>
            </div>
          </div>
          <div class="no_result" v-else>
            <div v-if="this.loading == false">抱歉，没有相关的搜索结果，请更改搜索条件</div>
          </div>
        </div>
        <div class="result_right">
          <hot-recommend
            :hotRecommend="adverList"
            :title="hotRecommendTitle"
          ></hot-recommend>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer_w">
      <m-footer></m-footer>
    </div>
    <!-- 登陆框 -->
    <div class="login_wraper">
      <transition name="slideUp">
        <common-login
          v-if="loginIsShow"
          @handleLoginClose="login"
          @loginSuccess="loginSuccess"
          @registerClick="register"
          @forgetPassword="forgetPassword"
        ></common-login>
      </transition>
      <transition name="fade">
        <div class="commonBg" v-if="loginIsShow" @click="login"></div>
      </transition>
    </div>
    <!-- 注册框 -->
    <div class="regiser_wraper">
      <transition name="slideUp">
        <common-register
          v-if="registerisShow"
          @handleRegisterClose="register"
          @registerSuccess="registerSuccess"
        ></common-register>
      </transition>
      <transition name="fade">
        <div class="commonBg" v-if="registerisShow" @click="register"></div>
      </transition>
    </div>
    <!-- 注册成功 -->
    <div class="success_wraper">
      <transition name="slideUp">
        <register-success v-if="successTip"></register-success>
      </transition>
      <transition name="fade">
        <div class="commonBg" v-if="successTip"></div>
      </transition>
    </div>
  </div>
</template>
<script>
import MHeader from "@/common/header/header";
import commonLogin from "@/common/login/login";
import MFooter from "@/common/footer/footer";
import commonRegister from "@/common/register/register";
import hotRecommend from "@/common/hot-recommend/hot-recommend";
// import Pagination from "@/common/pagination/pagination";

import registerSuccess from "@/common/success/success";
import API from "@/api/index";
import {httpGet} from "@/api/index";
import {mapState, mapMutations} from "vuex";
import $bus from "@/api/bus";

import base from "../../api/path";


export default {
  data() {
    return {
      checked: true,

      left_type: 1, //用来控制做测试目录结构还是做聚合，1是聚合，0是目录
      props: {
        label: 'dictLabel',
        isLeaf: 'isLeaf'
      },
      current_status: {
        keyword: "",
        search_field: 0,  //默认搜标题
        search_resource: 0,  //默认搜法律法规，这个值是前端资源类型的选中的下标，而不是数据库中的articletype
        sort_field: "publish_date_time",   //默认按发布日期排序
        sort_direction: "desc",
        effecLevel_tree: {
          code: "",
          name: ""
        },
        timeliness_tree: {
          code: "",
          name: ""
        },
        publishOffice_tree: {
          code: "",
          name: ""
        },
        // hierarchy_military_tree:{
        //   code:"",
        //   name:""
        // },
        // category_policy_tree:{
        //   code:"",
        //   name:""
        // },
        // category_industry_groups_tree:{
        //   code:"",
        //   name:""
        // },
        page_num: 1
      },
      result_count: 0, //检索成功后记录当前的命中数量
      result_count_show: 0,
      current_page: 1,

      keyWordList: [],
      leftTreeStatus: {
        effecLevel_tree: {
          code: "",
          name: ""
        },
        timeLiness_tree: {
          code: "",
          name: ""
        },
        publishOffice_tree: {
          code: "",
          name: ""
        },
        hierarchy_tree: {
          code: "",
          name: ""
        },
        category_policy_tree: {
          code: "",
          name: ""
        },
        category_industry_groups_tree: {
          code: "",
          name: ""
        }
      },

      // currentHitList:[],
      latestList: [],
      latestListSelect: [],


      showInput: true,
      loginIsShow: false,
      registerisShow: false,
      resultList: "",
      successTip: false,
      hotRecommendTitle: "热门推荐",
      search_resource: [
        {
          index: 0,
          text: "法律法规",
        },
        {
          index: 1,
          text: "党内法规",
        },
        {
          index: 2,
          text: "军事法规",
        },
        {
          index: 3,
          text: "政策",
        },
        {
          index: 4,
          text: "行政许可批复",
        },
        {
          index: 5,
          text: "行业团体规定",
        },
      ],
      search_field: [
        {
          index: 0,
          text: "标题",
        },
        {
          index: 1,
          text: "全文",
        },
        {
          index: 2,
          text: "文号",
        },
      ],
      padosege: 1,
      size: 10,
      pagesize: 10,

      key_word_list: [], //搜索条件
      adverList: [], //广告信息


      effecLevelId: "", // 效力级别,
      timeLiness: "", // 时效性,
      publishOfficeId: "", // 发布机关,

      loading: false,
      loading_effeclevel: true,
      loading_timeliness: true,
      loading_publishoffice: true,

      contentListLength: 4,// 全文检索 初始化 默认每页显示1条
      resultKeyWordsNull: null,

      searchContent: "",
      sortField: "publish_date_time",
      sortDirection: "desc",
      searchEffcLevel: "",
      searchPublishOffice: "",
      searchTimeLiness: "",

      leftList_effeclevl: [],
      leftList_timeliness: [],
      leftList_publishoffice: [],
      leftList: [],
      defaultProps: {
        children: 'children',
        label: 'dictLabel'
      }
    };
  },
  mounted() {
    this.current_status.keyword = this.homeSearchParam.keyword;
    this.current_status.search_field = this.homeSearchParam.search_field;
    this.current_status.search_resource = this.homeSearchParam.search_resource;

    // if(this.current_status.keyword === '') { //处理刷新
    //   this.$router.push({ path: "/" });
    //   return
    // }

    this.searchFromHomepage()
    this.getAdList(); //广告位
  },
  // beforeMount() {
  //   // let that = this;
  //   // $bus.$on("keysordsHandle", (t) => {
  //   //   this.getSearchListNoLogin();
  //   // });
  //   this.getAdList(); //广告位
  //   // this.getLatest()
  //
  // },
  computed: {
    ...mapState([
      "userInfo",
      "token",
      "keyWord",
      "EffecLevel",
      "PulishOffice",
      "timeLinessList",

      "keyWordSubmit",
      "orderBy",
      "direction",
      "resultKeyWords",
      // "resultTypes",
      //
      // //
      // "searchParams",
      // "current_search_text",
      "homeSearchParam",
      // "search_fw_current",
    ]),
  },
  methods: {
    ...mapMutations([
      "setState",
      "setKeyWord",
      "setKeywordsSubmit",
      "setOrderBy",
      "setDirection",
      "setresultKeyWords",
      "setresultTypes",
      // "setsearch_fw_current",
      "clearAllKeyWord",
      "setCurrentSearchText"
    ]),
    loadNode_effecLevl(node, resolve) {
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level === 0) {
        this.loadfirstnode(base.catalog_effecLevel, resolve);
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildnode(base.catalog_effecLevel, node, resolve);
      }
    },
    loadNode_timeliness(node, resolve) {
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level === 0) {
        this.loadfirstnode(base.catalog_timeliness, resolve);
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildnode(base.catalog_timeliness, node, resolve);
      }
    },
    loadNode_publishOffice(node, resolve) {
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level == 0) {
        this.loadfirstnode(base.catalog_publishOffice, resolve);
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildnode(base.catalog_publishOffice, node, resolve);
      }
    },
    loadNode_hierarchy_party_law(node, resolve) {
      // console.log(node)
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level == 0) {
        this.loadfirstnode(base.hierarchy_party_law, resolve);
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildnode(base.hierarchy_party_law, node, resolve);
      }
    },
    loadNode_hierarchy_military(node, resolve) {
      // console.log(node)
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level == 0) {
        this.loadfirstnode(base.hierarchy_military, resolve);
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildnode(base.hierarchy_military, node, resolve);
      }
    },
    loadNode_category_policy(node, resolve) {
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level == 0) {
        this.loadfirstnode(base.category_policy, resolve);
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildnode(base.category_policy, node, resolve);
      }
    },
    loadNode_category_industry_groups(node, resolve) {
      //如果展开第一级节点，从后台加载一级节点列表
      if (node.level == 0) {
        this.loadfirstnode(base.category_industry_groups, resolve);
      }
      //如果展开其他级节点，动态从后台加载下一级节点列表
      if (node.level >= 1) {
        this.loadchildnode(base.category_industry_groups, node, resolve);
      }
    },
    //加载第一级节点
    async loadfirstnode(current_url, resolve) {
      await httpGet(current_url).then(res => {
        // console.log(res)
        if (res.code === 0) {
          return resolve(res.data);
        }
      });
    },
    //加载节点的子节点集合
    async loadchildnode(current_url, node, resolve) {
      console.log(current_url)
      console.log(node)
      await httpGet(current_url + '?dictCode=' + node.data.dictCode).then(res => {
        // console.log(res)
        if (res.code === 0) {
          return resolve(res.data);
        }
      });
    },
    searchFromHomepage() {
      // if (!this.userInfo.noDataSearch && this.current_status.keyword === '') {
      //   this.$message({
      //     message: "请输入关键词进行检索！",
      //   });
      //   return false
      // }

      this.getResultList(this.current_status);

      if (this.left_type === 1)
        this.getLeftTree(this.current_status);
    },
    searchFromHeader(keyword) {
      // if (!this.userInfo.noDataSearch && keyword === '') {
      //   this.$message({
      //     message: "请输入关键词进行检索！",
      //   });
      //   return false
      // }

      this.current_status.keyword = keyword;
      this.current_status.page_num = 1
      // this.current_status.search_field=0;  顶部的搜索不要去变动当前的搜索范围
      this.current_status.sort_field = "publish_date_time";
      this.current_status.sort_direction = "desc";
      this.current_status.effecLevel_tree.code = "";
      this.current_status.effecLevel_tree.name = "";
      this.current_status.timeliness_tree.code = "";
      this.current_status.timeliness_tree.name = "";
      this.current_status.publishOffice_tree.code = "";
      this.current_status.publishOffice_tree.name = "";

      // console.log(this.current_status.search_resource)
      this.getResultList(this.current_status)
      if (this.left_type == 1)
        this.getLeftTree(this.current_status)
    },
    searchFromSeachResource(index) {
      // if (!this.userInfo.noDataSearch && this.current_status.keyword === '') {
      //   this.$message({
      //     message: "请输入关键词进行检索！",
      //   });
      //   return false
      // }

      //变动搜索范围时，当前的搜索条件只改变search_field，且把左侧清空复原，请求第一页
      // this.current_status.search_field=index;
      this.current_status.search_resource = index;
      this.current_status.page_num = 1;
      this.current_status.effecLevel_tree.code = "";
      this.current_status.effecLevel_tree.name = "";
      this.current_status.timeliness_tree.code = "";
      this.current_status.timeliness_tree.name = "";
      this.current_status.publishOffice_tree.code = "";
      this.current_status.publishOffice_tree.name = "";

      console.log('here', this.current_status)
      this.getResultList(this.current_status)

      if (this.left_type === 1)
        this.getLeftTree(this.current_status)
    },
    searchFromSearchField(index) {
      // if (!this.userInfo.noDataSearch && this.current_status.keyword === '') {
      //   this.$message({
      //     message: "
      //     请输入关键词进行检索！",
      //   });
      //   return false
      // }

      //变动搜索范围时，当前的搜索条件只改变search_field，且把左侧清空复原，请求第一页
      this.current_status.search_field = index;
      this.current_status.page_num = 1;
      this.current_status.effecLevel_tree.code = "";
      this.current_status.effecLevel_tree.name = "";
      this.current_status.timeliness_tree.code = "";
      this.current_status.timeliness_tree.name = "";
      this.current_status.publishOffice_tree.code = "";
      this.current_status.publishOffice_tree.name = "";

      this.getResultList(this.current_status)
      if (this.left_type === 1)
        this.getLeftTree(this.current_status)
    },
    handleCurrentChange(page_number) {
      // if (!this.userInfo.noDataSearch && this.current_status.keyword === '') {
      //   this.$message({
      //     message: "请输入关键词进行检索！",
      //   });
      //   return false
      // }

      this.current_status.page_num = page_number
      this.getResultList(this.current_status)
    },//列表页分页的点击事件函数
    handleNodeClick(item) {  //点击左侧项
      // console.log(item.dictType)
      if (item.dictType === "EffecLevel") {
        this.current_status.effecLevel_tree.code = item.dictCode;
        this.current_status.effecLevel_tree.name = item.dictLabel.split('(')[0]

        this.get_tree('TimeLiness', this.current_status)
        this.get_tree('PublishOffice', this.current_status)
      } else if (item.dictType === "TimeLiness") {
        this.current_status.timeliness_tree.code = item.dictCode;
        this.current_status.timeliness_tree.name = item.dictLabel.split('(')[0]

        this.get_tree('EffecLevel', this.current_status)
        this.get_tree('PublishOffice', this.current_status)
      } else if (item.dictType === "PulishOffice") {
        this.current_status.publishOffice_tree.code = item.dictCode;
        this.current_status.publishOffice_tree.name = item.dictLabel.split('(')[0]

        this.get_tree('EffecLevel', this.current_status)
        this.get_tree('TimeLiness', this.current_status)
      }
      // 下面4个，从树的节点获得的值，仍然是放进effecLevel去进行查询，因为数据库是这么设计的
      else if (item.dictType === "hierarchy_party_law") {
        this.current_status.effecLevel_tree.code = item.dictCode;
        this.current_status.effecLevel_tree.name = item.dictLabel.split('(')[0]

        this.get_tree('TimeLiness', this.current_status)
        this.get_tree('PublishOffice', this.current_status)
      } else if (item.dictType === "hierarchy_military") {
        this.current_status.effecLevel_tree.code = item.dictCode;
        this.current_status.effecLevel_tree.name = item.dictLabel.split('(')[0]

        this.get_tree('TimeLiness', this.current_status)
        this.get_tree('PublishOffice', this.current_status)
      } else if (item.dictType === "category_policy") {
        this.current_status.effecLevel_tree.code = item.dictCode;
        this.current_status.effecLevel_tree.name = item.dictLabel.split('(')[0]

        this.get_tree('TimeLiness', this.current_status)
        this.get_tree('PublishOffice', this.current_status)
      } else if (item.dictType === "category_industry_groups") {
        this.current_status.effecLevel_tree.code = item.dictCode;
        this.current_status.effecLevel_tree.name = item.dictLabel.split('(')[0]

        this.get_tree('TimeLiness', this.current_status)
        this.get_tree('PublishOffice', this.current_status)
      } else
        return;

      this.current_status.page_num = 1;

      this.getResultList(this.current_status);

      // if(this.left_type===1)
      //   this.getLeftTree(this.current_status)
    },
    onDeleteTreeItem(item) {  //从顶部搜索条件中去掉项目
      if (item === "效力级别") {
        this.current_status.effecLevel_tree.name = "";
        this.current_status.effecLevel_tree.code = ""
      } else if (item === "时效性") {
        this.current_status.timeliness_tree.name = "";
        this.current_status.timeliness_tree.code = ""
      } else if (item === "发布机关") {
        this.current_status.publishOffice_tree.name = "";
        this.current_status.publishOffice_tree.code = ""
      } else
        return

      this.current_status.page_num = 1;

      this.getResultList(this.current_status);
      if (this.left_type === 1)
        this.getLeftTree(this.current_status)
    },
    onSortClick(field, direction) {  //排序
      // if (!this.userInfo.noDataSearch && this.current_status.keyword === '') {
      //   this.$message({
      //     message: "请输入关键词进行检索！",
      //   });
      //   return false
      // }

      this.current_status.sort_field = field;
      this.current_status.sort_direction = direction;

      this.getResultList(this.current_status)
    },

    getResultList(status) {

      let param = {
        page: 1,
        size: 10,
        articleType: 0,  //法律法规

        articleTitle: "",
        articleContent: "",
        publishNum: "",
        orderBy: "publish_date_time",
        direction: "desc",
        effecLevelId: "",
        publishOfficeId: "",
        timeLiness: ""
      }

      //处理关键词，排序项，排序方向，左侧选中项，列表页页码
      if (status.search_field === 0)
        param.articleTitle = status.keyword;
      else if (status.search_field === 1)
        param.articleContent = status.keyword;
      else
        param.publishNum = status.keyword; //发文字号

      if (status.search_resource === 0)
        param.articleType = 1
      else
        param.articleType = status.search_resource + 4

      param.orderBy = status.sort_field;
      param.direction = status.sort_direction;

      param.effecLevelId = status.effecLevel_tree.code;
      param.timeLiness = status.timeliness_tree.code;
      param.publishOfficeId = status.publishOffice_tree.code;

      param.page = status.page_num;

      // console.log(param)
      this.doSearch(param);
    },
    getLeftTree(status) {

      let param = {
        page: 1,
        size: 10,
        articleType: 0,  //法律法规

        articleTitle: "",
        articleContent: "",
        publishNum: "",
        orderBy: "publish_date_time",
        direction: "desc",
        effecLevelId: "",
        publishOfficeId: "",
        timeLiness: ""
      }

      //处理关键词，排序项，排序方向，左侧选中项，列表页页码
      if (status.search_field === 0)
        param.articleTitle = status.keyword;
      else if (status.search_field === 1)
        param.articleContent = status.keyword;
      else
        param.publishNum = status.keyword; //发文字号

      if (status.search_resource === 0)
        param.articleType = 1
      else
        param.articleType = status.search_resource + 4

      param.orderBy = status.sort_field;
      param.direction = status.sort_direction;

      param.effecLevelId = status.effecLevel_tree.code;
      param.timeLiness = status.timeliness_tree.code;
      param.publishOfficeId = status.publishOffice_tree.code;

      param.page = status.page_num;

      // console.log(param)
      this.doAggregate(param);


      ///////////
      // let param={
      //   articleType: 1,
      //   articleTitle:"",
      //   articleContent:"",
      //   effecLevelId:"",
      //   publishOfficeId:"",
      //   timeLiness:""
      // }
      //
      // //处理关键词
      // if(status.search_field===1)
      //   param.articleContent = status.keyword;
      // else
      //   param.articleTitle = status.keyword;
      //
      // param.effecLevelId = status.effecLevel_tree.code;
      // param.timeLiness = status.timeliness_tree.code;
      // param.publishOfficeId = status.publishOffice_tree.code;
      //
      // this.doAggregate(param)
    },

    async doSearch(searchParam) {
      this.loading = true;
      await httpGet(this.token ? base.result : base.restResult, this.token, searchParam).then((res) => {
        // console.log(res.data)
        if (res.code === 0) {
          this.loading = false

          // //这段用来处理全文检索的文中命中部分数据
          res.data.data.content.forEach((item, index) => {
            if (item.contentList && this.current_status.search_field === 1) { //有命中列表且是全文检索
              if (item.contentList.length < 5) {
                item.currentList = item.contentList;
                item.currentTabIndex = 1;
                item.allTabIndex = 1;
              } else {
                item.currentTabIndex = 1;
                (item.allTabIndex = item.contentList.length / 4 > 0 ? parseInt(item.contentList.length / 4) + 1 : item.contentList.length / 4), (item.currentList = item.contentList.slice(0, this.contentListLength));
              }
            }
          });
          //////////////////

          this.resultList = res.data.data.content;
          // console.log('看这里',this.resultList)
          this.result_count = res.data.data.totalElements;  //用作命中数显示
          this.result_count_show = res.data.data.totalElements;
          if (this.result_count_show >= 300) {
            this.result_count_show = 300;
          }
        }
      })
    },
    async doAggregate(para) {
      // //同步处理左侧聚合
      this.loading_effeclevel = true;
      this.loading_timeliness = true;
      this.loading_publishoffice = true;

      await httpGet(base.aggreateEffeclevel, "", para).then(res => {
        if (res.code === 0) {
          console.log('aggreateEffeclevel', res.data)
          this.leftList_effeclevl = res.data;
          this.loading_effeclevel = false
        }
      });

      await httpGet(base.aggreateTimeliness, "", para).then(res => {
        if (res.code === 0) {
          console.log('aggreateTimeliness', res.data)
          this.leftList_timeliness = res.data;
          this.loading_timeliness = false
        }
      });

      await httpGet(base.aggreatePublishOffice, "", para).then(res => {
        if (res.code === 0) {
          console.log('aggreatePublishOffice', res.data)
          this.leftList_publishoffice = res.data;
          this.loading_publishoffice = false
        }
      });
    },
    async get_tree(str_type, status) {
      let param = {
        page: 1,
        size: 10,
        articleType: 0,  //法律法规

        articleTitle: "",
        articleContent: "",
        publishNum: "",
        orderBy: "publish_date_time",
        direction: "desc",
        effecLevelId: "",
        publishOfficeId: "",
        timeLiness: ""
      }

      //处理关键词，排序项，排序方向，左侧选中项，列表页页码
      if (status.search_field === 0)
        param.articleTitle = status.keyword;
      else if (status.search_field === 1)
        param.articleContent = status.keyword;
      else
        param.publishNum = status.keyword; //发文字号

      if (status.search_resource === 0)
        param.articleType = 1
      else
        param.articleType = status.search_resource + 4

      param.orderBy = status.sort_field;
      param.direction = status.sort_direction;

      param.effecLevelId = status.effecLevel_tree.code;
      param.timeLiness = status.timeliness_tree.code;
      param.publishOfficeId = status.publishOffice_tree.code;

      param.page = status.page_num;

      if (str_type === 'EffecLevel') {
        this.loading_effeclevel = true;
        await httpGet(base.aggreateEffeclevel, "", param).then(res => {
          if (res.code === 0) {
            console.log('aggreateEffeclevel', res.data)
            this.leftList_effeclevl = res.data;
            this.loading_effeclevel = false
          }
        });
      } else if (str_type === 'TimeLiness') {
        this.loading_timeliness = true;
        await httpGet(base.aggreateTimeliness, "", param).then(res => {
          if (res.code === 0) {
            console.log('aggreateTimeliness', res.data)
            this.leftList_timeliness = res.data;
            this.loading_timeliness = false
          }
        });
      } else if (str_type === 'PublishOffice') {
        this.loading_publishoffice = true;
        await httpGet(base.aggreatePublishOffice, "", param).then(res => {
          if (res.data.code === 0) {
            console.log('aggreatePublishOffice', res.data)
            this.leftList_publishoffice = res.data;
            this.loading_publishoffice = false
          }
        });
      } else {
        console.log('error')
      }
    },
    next(item) {
      if (item.currentTabIndex < item.allTabIndex) {
        item.currentTabIndex++;
        item.currentList = item.contentList.slice(
          (item.currentTabIndex - 1) * 4,
          item.currentTabIndex * 4
        );
      }
    },//全文命中的翻页
    prev(item) {
      if (item.currentTabIndex > 1) {
        item.currentTabIndex--;
        item.currentList = item.contentList.slice(
          (item.currentTabIndex - 1) * 4,
          item.currentTabIndex * 4
        );
      }
    },

    // getLatest(){
    //   httpGet('/api/article/rest/publishDateTimeList').then((res)=>{
    //     console.log(res)
    //     if(res.code == 0){
    //       this.latestList = res.data
    //       this.latestListSelect = this.latestList.slice(0,8)
    //     }
    //   })
    // },


    /////////////////////////////////////////////////
    searchOnInput(e) {
      this.setresultKeyWords(e);
    },
    orderClick(t, d) {
      this.setOrderBy(t);
      this.setDirection(d)
      this.getSearchListNoLogin();
    },
    registerSuccess() {
      //注册成功
      let that = this;
      that.loginIsShow = false;
      that.registerisShow = false;
      that.successTip = true;
      setTimeout(function () {
        that.successTip = false;
        that.loginIsShow = true;
      }, 2000);
    },
    login() {
      //登陆按钮点击弹出登陆框
      this.loginIsShow = !this.loginIsShow;
      this.registerisShow = false;
    },
    register() {
      //注册按钮点击弹出注册框
      this.registerisShow = !this.registerisShow;
      this.loginIsShow = false;
    },
    forgetPassword() {
      //忘记密码
      this.$router.push("/forgetPassword.html");
    },
    getAdList() {
      //获取广告
      let that = this;
      httpGet("/api/adver/rest/list/1", that.token, {}).then((res) => {
        if (res.code == 0) {
          this.adverList = res.data;
        }
      });
    },
    getSearchListNoLogin(type, resultTypes, indexId) {
      if (!this.userInfo.noDataSearch && !this.searchContent) {
        if (resultTypes != undefined) {
          this.setresultTypes(resultTypes);
        }
        if (indexId != undefined) {
          this.setsearch_fw_current(indexId);
        }
        this.setKeyWord([]);
        this.clearAllKeyWord();
        return;
      }
      this.loading = true;
      //搜索结果
      if (type != 1) {
        this.page = 1;
      }
      // 这个indexId是用来区分标题检索或者全文检索，代码写得真太垃圾了
      if (indexId != undefined) {
        if (indexId == 0) {
          var titleText = this.searchContent;
          var contentText = "";
        } else if (indexId == 1) {
          var titleText = "";
          var contentText = this.searchContent;
        }
      } else {
        if (this.search_fw_current == 0) {
          var titleText = this.searchContent;
          var contentText = "";
        } else if (this.search_fw_current == 1) {
          var titleText = "";
          var contentText = this.searchContent;
        }
      }
      // 这段是用来处理排序
      let orderByData = ''
      let directionData = '';
      if ((!this.searchContent || this.searchContent == ' ') && !this.orderBy) {
        indexId = 0
        orderByData = 'publish_date_time'
        directionData = 'desc'
      } else {
        orderByData = this.orderBy
        directionData = this.direction
      }

      var data = {
        articleTitle: titleText,
        articleContent: contentText,
        page: this.page,
        size: this.size,
        //articleType: resultTypes * 1 + 1 || this.resultTypes * 1 + 1,
        articleType: 1,
        effecLevelId: this.keyWordSubmit.effecLevelId, // 效力级别,
        timeLiness: this.keyWordSubmit.timeLinessID, // 时效性,
        publishOfficeId: this.keyWordSubmit.publishOfficeId, // 发布机关,

        // publishDateId: this.keyWordSubmit.publishDateId, //发布时间
        //
        // causeActionId: this.keyWordSubmit.causeActionId, // 案由,
        // referenceLevelId: this.keyWordSubmit.referenceLevelId, // 参照级别,
        // trialCourtId: this.keyWordSubmit.trialCourtId, // 审理法院,
        // trialProcedureId: this.keyWordSubmit.trialProcedureId, // 审理程序,
        // textType: this.keyWordSubmit.textType, // 文书类型,
        // courtHierarchyId: this.keyWordSubmit.courtHierarchyId, // 法院层级,
        // yearConclusionId: this.keyWordSubmit.yearConclusionId, // 审结年份,
        //
        // fieldId: this.keyWordSubmit.fieldId, // 领域,
        // categoryId: this.keyWordSubmit.categoryId, // 类别,
        // signTimeId: this.keyWordSubmit.signTimeId, // 签订年份,
        //
        // effecLevelEnglishId: this.keyWordSubmit.effecLevelEnglishId, // 效力级别,
        // timeLinessEnglish: this.keyWordSubmit.timeLinessEnglishId, // 时效性,
        // publishOfficeEnglishId: this.keyWordSubmit.publishOfficeEnglishId, //发布机关
        // publishDateEnglishId: this.keyWordSubmit.publishDateEnglishId, //发布日期

        orderBy: orderByData, //排序
        direction: directionData, //排序 正序倒序


      };

      // this.resultList = "";
      let requestUrl = "",
        token = "";
      if (this.token) {
        requestUrl = "/api/article/pageList";
        token = this.token;
      } else {
        alert(1)
        requestUrl = "/api/article/rest/pageList";
        token = "";
      }
      httpGet(requestUrl, token, data)
        .then((res) => {
          if (res.code == 0) {
            this.loading = false;
            // 先注释掉，有问题再搞回来
            // if (resultTypes * 1 + 1) {
            //   this.setresultTypes(resultTypes);
            // }
            if (res.data.data.content.length <= 0) {
              this.resultList = {
                content: [],
              };
              if (indexId != undefined) {
                this.setsearch_fw_current(indexId);
              }
              return false;
            }
            if (res.data.effecLevel && res.data.effecLevel.length) {
              this.setState({
                data: res.data.effecLevel,
                type: "EffecLevel",
              });
            }
            if (res.data.publishOffice && res.data.publishOffice.length) {
              this.setState({
                data: res.data.publishOffice,
                type: "PulishOffice",
              });
            }
            if (res.data.publishDate && res.data.publishDate.length) {
              this.setState({
                data: res.data.publishDate,
                type: "PulishDate",
              });
            }
            // if (res.data.trialCourt && res.data.trialCourt.length) {
            //   this.setState({
            //     data: res.data.trialCourt,
            //     type: "TrialCourt",
            //   });
            // }
            // if (res.data.courtHierarchy && res.data.courtHierarchy.length) {
            //   this.setState({
            //     data: res.data.courtHierarchy,
            //     type: "CourtHierarchy",
            //   });
            // }
            // if (res.data.yearConclusion && res.data.yearConclusion.length) {
            //   this.setState({
            //     data: res.data.yearConclusion,
            //     type: "YearOfConclusion",
            //   });
            // }
            //
            // /***案例 */
            // if (res.data.causeOfAction && res.data.causeOfAction.length) {
            //   this.setState({
            //     data: res.data.causeOfAction,
            //     type: "CauseOfAction",
            //   });
            // }
            // if (res.data.referenceLevel && res.data.referenceLevel.length) {
            //   this.setState({
            //     data: res.data.referenceLevel,
            //     type: "ReferenceLevel",
            //   });
            // }
            // if (res.data.textType && res.data.textType.length) {
            //   this.textType = [];
            //   res.data.textType.forEach((item) => {
            //     this.textType.push({
            //       dictCode: item,
            //       dictLabel:
            //         item == "01"
            //           ? "判决书"
            //           : item == "02"
            //           ? "裁定书"
            //           : item == "03"
            //           ? "调解书"
            //           : item == "04"
            //           ? "决定书"
            //           : item == "05"
            //           ? "通知书"
            //           : item == "09"
            //           ? "令"
            //           : "其它",
            //       dictType: "textType",
            //       hasChild: false,
            //     });
            //   });
            // }
            // /**条约 */
            // if (res.data.field && res.data.field.length) {
            //   this.setState({
            //     data: res.data.field,
            //     type: "Field",
            //   });
            // }
            // if (res.data.category && res.data.category.length) {
            //   this.setState({
            //     data: res.data.category,
            //     type: "Category",
            //   });
            // }
            // if (res.data.yearOfSigning && res.data.yearOfSigning.length) {
            //   this.setState({
            //     data: res.data.yearOfSigning,
            //     type: "YearOfSigning",
            //   });
            // }
            // /*英文 */
            // if (res.data.effecLevelEnglish && res.data.effecLevelEnglish.length) {
            //   this.setState({
            //     data: res.data.effecLevelEnglish,
            //     type: "EffecLevelEnglish",
            //   });
            // }
            // if (res.data.pulishOfficeEnglish && res.data.pulishOfficeEnglish.length) {
            //   this.setState({
            //     data: res.data.pulishOfficeEnglish,
            //     type: "PulishOfficeEnglish",
            //   });
            // }
            // if (res.data.pulishDateEnglish && res.data.pulishDateEnglish.length) {
            //   this.setState({
            //     data: res.data.pulishDateEnglish,
            //     type: "PulishDateEnglish",
            //   });
            // }

            res.data.data.content.forEach((item, index) => {
              if (item.contentList) {
                if (titleText) {
                  item.currentList = item.contentList
                } else {
                  item.currentTabIndex = 1;
                  (item.allTabIndex = item.contentList.length / 4 > 0 ? parseInt(item.contentList.length / 4) + 1 : item.contentList.length / 4), (item.currentList = item.contentList.slice(0, this.contentListLength));
                }
              }
            });
            this.resultList = res.data.data;
            this.resultList.currentTotalElements = this.resultList.totalElements;
            if (this.resultList.totalElements >= 500) {
              this.resultList.totalElements = 500;
            }
          } else {
            this.loading = false;
          }
          if (resultTypes != undefined) {
            this.setresultTypes(resultTypes);
          }
          if (indexId != undefined) {
            this.setsearch_fw_current(indexId);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    loginSuccess() {
      //登录成功后请求数据
      this.getSearchListNoLogin();
    },
    goDetail(item) {
      //进入详情页
      window.open(location.origin + `/${item.articleId}.html`);
    },
    collect(item) {
      if (!this.token) {
        this.loginIsShow = true;
        return false;
      }
      if (item.isCollect) {
        this.cancleCollection(item);
        return false;
      }
      if (!this.isCollect) {
        this.collection(item);
      }
    },
    //点赞
    praiseArticle(item) {
      API.praiseArticle(item.articleId,true).then((res) => {
        if (res.code == 0 || res.code == 120) {
          this.$message({
            type: "success",
            message: "点赞成功",
          });
          item.isPraise = true;
          item.praiseNum += 1
        } else {
          this.$message({
            type: "info",
            message: res.mess,
          });
        }
      })
    },
    //取消点赞
    canclePraise(item) {
      API.praiseArticle(item.articleId,true).then((res) => {
        if (res.code == 0 || res.code == 120) {
          this.$message({
            type: "success",
            message: "取消点赞成功",
          });
          item.isPraise = false;
          item.praiseNum -= 1
        } else {
          this.$message({
            type: "info",
            message: res.mess,
          });
        }
      })
    },
    //收藏
    collection(item) {
      API.userCollection(item.articleId).then(
        (res) => {
          if (res.code == 0 || res.code == 120) {
            this.$message({
              type: "success",
              message: "收藏成功",
            });
            item.isCollect = true;
            item.collectNum += 1
          } else {
            this.$message({
              type: "info",
              message: res.mess,
            });
          }
        }
      );
    },
    //取消收藏
    cancleCollection(item) {
      API.deleteAllCollectCancel(item.articleId).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "取消收藏成功",
          });
          item.isCollect = false;
          item.collectNum -= 1
        } else {
          this.$message({
            type: "info",
            message: res.mess,
          });
        }
      });
    },
  },
  beforeDestroy() {
    $bus.$off("keysordsHandle", this.myhandle);
  },
  components: {
    MHeader,
    commonLogin,
    commonRegister,
    hotRecommend,
    MFooter,
    registerSuccess,
    // Pagination,
  },
};
</script>
<style scoped lang="scss">
.container {
  background-color: #f5f5f5;
  min-width: 1280px;

  .header_wraper {
    height: 70px;
  }

  .content {
    box-shadow: 0 0 2px rgba(0, 0, 0, .1);
    margin: 8px auto 0;
    width: 1400px;
    background-color: #ffffff;
    @media screen and (max-width: 1740px) {
      width: 1400px;
    }
    @media screen and (max-width: 1440px) {
      width: 95%;
      margin-left: auto;
      margin-right: auto;
    }

    .main_types {
      ul {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #333;
        @media screen and (max-width: 1440px) {
          font-size: 15px;
        }

        li {
          margin-right: 20px;
          padding: 0 5px;
          line-height: 24px;
          cursor: pointer;
        }

        li.active {
          font-weight: bold;
          border-bottom: 2px solid #0168c1;
        }
      }
    }

    .search_resource {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 1;
      padding-top: 18px;
      padding-left: 18px;
      padding-bottom: 30px;

      @media screen and (max-width: 1440px) {
        font-size: 13px;
      }

      span {
        margin-right: 22px;
        cursor: pointer;

        &:first-child {
          margin-right: 5px;
          color: #333;
          cursor: default;

          &:hover {
            color: #333;
          }
        }

        &.disabled {
          &:hover {
            cursor: text;
            color: #000;
          }
        }

        &:hover {
          color: #0168c1;
        }
      }

      span.active {
        color: #0168c1;
        font-weight: bold;
      }
    }

    .search_fw {
      display: flex;
      align-items: center;
      font-size: 14px;
      line-height: 1;
      padding-left: 18px;
      padding-bottom: 20px;

      @media screen and (max-width: 1440px) {
        font-size: 13px;
      }

      span {
        margin-right: 22px;
        cursor: pointer;

        &:first-child {
          margin-right: 5px;
          color: #333;
          cursor: default;

          &:hover {
            color: #333;
          }
        }

        &.disabled {
          &:hover {
            cursor: text;
            color: #000;
          }
        }

        &:hover {
          color: #0168c1;
        }
      }

      span.active {
        color: #0168c1;
        font-weight: bold;
      }
    }

    .key_word_w {
      box-sizing: border-box;
      padding-left: 18px;
      padding-right: 18px;
      padding-bottom: 15px;
      display: flex;
      align-items: center;
      font-size: 14px;
      @media screen and (max-width: 1440px) {
        font-size: 13px;
        margin-top: 13px;
      }

      .key_word_list {
        display: flex;
        align-items: center;
        // margin-right: 15px;
        .key_word_title {
          color: #333;
          // margin-right: 5px;
          // width: 50px;
          // flex: 0 0 50px;
          margin-top: 5px;
        }

        .key_wor_item {
          img {
            cursor: pointer;
          }
        }

        ul {
          display: flex;
          align-items: center;
          color: #f95e39;
          margin-right: 5px;
          margin-top: 5px;
          float: left;

          li {
            margin-right: 4px;
            padding: 0 10px 0 5px;
            border: 1px dashed #f95e39;
            margin-left: 5px;
            display: flex;
            align-items: center;

            span {
              // margin-right: 15px;
              // line-height: 17px;
            }

            img {
              // width: 10px;
              margin-left: 5px;
            }
          }
        }
      }

      .total_result {
        font-size: 14px;
        display: flex;
        align-items: center;
        flex: 0 0 120px;
        margin-top: 5px;
        flex: 1;
        @media screen and (max-width: 1440px) {
          font-size: 13px;
        }

        span {
          color: #f95e39;
          padding: 0 4px;
          font-weight: bold;
        }
      }
    }

    .test {
      white-space: normal;
    }
  }

  .no_reslut_all {
    display: flex;
    justify-content: center;
    margin-top: 25px;
    border-top: 1px solid #e2e8eb;
    padding-top: 50px;
    min-height: calc(100vh - 300px);
  }

  .result_wraper {
    position: relative;
    margin: 8px auto 25px;
    //background-color: #55a532;
    //border-top: 1px solid #e2e8eb;
    box-sizing: border-box;
    // margin-right: 30px;
    min-height: calc(100vh - 266px);

    .result_content {
      display: flex;
      flex-direction: row;
      margin: 0px auto 0;
      width: 1400px;
      @media screen and (max-width: 1740px) {
        width: 1400px;
      }
      @media screen and (max-width: 1440px) {
        width: 95%;
        margin-left: auto;
        margin-right: auto;
      }
    }

    .result_left {
      width: 260px;
      flex: 0 0 260px;
      font-size: 12px;
      color: #131313;

      .left_tree_wraper_a {
        .left_tree_wraper {
          box-shadow: 0 0 2px rgba(0, 0, 0, .1);
          background-color: #ffffff;
          margin-bottom: 8px;

          .tree_title {
            padding-left: 15px;
            padding-right: 15px;
            padding-top: 15px;
          }

          .left_tree {
            padding-left: 5px;
            padding-right: 10px;
            padding-bottom: 10px;

            > > > .el-tree-node {
              white-space: normal;
              padding-top: 4px;
              padding-bottom: 4px;

              .el-tree-node-content {
                height: 100%;
                align-items: start;
              }
            }
          }

          .tree_item {
            margin-top: 10px;
          }
        }
      }

      .left_tree_wraper_b {
        .tree_catalog_wraper {
          box-shadow: 0 0 2px rgba(0, 0, 0, .1);
          background-color: #ffffff;
          margin-bottom: 8px;

          .tree_title {
            padding-left: 20px;
            padding-top: 12px;
          }

          .tree_catalog {
            padding-top: 10px;
            padding-left: 12px;
            padding-right: 12px;
            padding-bottom: 15px;
          }
        }
      }
    }

    .result_middle {
      box-shadow: 0 0 2px rgba(0, 0, 0, .1);
      background-color: #ffffff;
      width: 0;
      flex: 1;
      padding: 0 25px;
      margin-left: 8px;
      margin-right: 8px;
      @media screen and (max-width: 1440px) {
        padding: 0 20px;
      }

      .sort_types {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #666;
        margin-top: 15px;
        border-bottom: 1px solid #e2e8eb;
        padding-bottom: 10px;
        // 新增 上下箭头 20220103 by jing
        .arrow-wrap {
          width: 6px;
          height: 10px;
          position: relative;
          margin-left: 5px;

          i {
            height: 0;
            width: 0;
            font-size: 0;
            border-left: 4px solid transparent;
            border-right: 4px solid transparent;
            position: absolute;
            left: 0;
            cursor: pointer;

            &.active {
              &.arrow-top {
                border-bottom-color: #0168c1;
              }

              &.arrow-bottom {
                border-top-color: #0168c1;
              }
            }

            &.arrow-top {
              border-bottom: 5px solid #909399;
              top: 2px;

              &:hover {
                border-bottom-color: #0168c1;
              }
            }

            &.arrow-bottom {
              border-top: 5px solid #909399;
              bottom: 2px;

              &:hover {
                border-top-color: #0168c1;
              }
            }
          }
        }

        span {
          margin-right: 25px;
          cursor: pointer;
        }

        span:first-child {
          margin-right: 5px;
          cursor: default;
        }

        span.active {
          color: #0168c1;
        }

        span.relativity {
          .arrow-wrap {
            .arrow-bottom {
              top: 7px;
            }
          }
        }
      }

      .result_list {
        padding-bottom: 80px;

        ul {
          // margin-top: 15px;
          .result_item {
            padding: 10px 0;
            transition: all 0.2s;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);

            .title_wraper {
              display: flex;
              justify-content: space-between;
              overflow: hidden;

              .title_status {
                display: flex;
                align-items: center;

                .status {
                  height: 26px;
                  padding: 0 10px 0 15px;
                  // width: 80px;
                  line-height: 26px;
                  text-align: center;
                  box-sizing: border-box;
                  font-size: 14px;
                  color: #ffffff;
                  background: #eac220;
                  @media screen and (max-width: 1440px) {
                    font-size: 12px;
                  }
                }

                .effective_no {
                  background: #eac220;
                }

                .effective_no_line {
                  border: 13px solid transparent;
                  border-left-color: #eac220;
                }

                .effective {
                  background: #16a660;
                }

                .effective_line {
                  border: 13px solid transparent;
                  border-left-color: #16a660;
                }
              }

              .title_con {
                font-size: 18px;
                //color: #222;
                color: #131313;
                flex: 1;
                margin-right: 10px;

                > div {
                  span {
                    cursor: pointer;

                    &:hover {
                      color: #0168c1;
                    }
                  }
                }

                //overflow: hidden;
                //text-overflow: ellipsis;
                //white-space: nowrap;
                @media screen and (max-width: 1440px) {
                  font-size: 16px;
                }
              }

              .collection_wraper {
                margin-right: 10px;
                padding-top: 6px;
                font-size: 14px;
                display: flex;
                color: #222;

                .iconfont {
                  margin-right: 3px;
                  vertical-align: middle;
                  position: relative;

                  &.icon-favorites {
                    font-size: 16px;
                    color: #606266;
                    top: 0px;
                  }

                  &.icon-favorite {
                    font-size: 16px;
                    color: #606266;
                    top: 1px;
                  }

                  &.icon-favorites-fill {
                    font-size: 16px;
                    color: #0168c1;
                    top: -4px;
                  }

                  &.icon-favorite-fill {
                    color: #0168c1;
                  }
                }

                img {
                  width: 18px;
                  height: 18px;
                  margin-right: 3px;
                }

                span {
                  height: 18px;
                }

                .line {
                  height: 14px;
                  border-left: 1px solid #c5d1d7;
                  margin: 0 10px;
                  position: relative;
                  top: 2px;
                }
              }
            }

            .new-status-name {
              font-size: 12px;
              color: #ffffff;
              text-align: center;
              background: #20bb5a;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 0 5px;
              width: 36px;
              height: 22px;
              line-height: 22px;
              border-radius: 3px;
              margin: 6px 0;

              &.no-effect {
                background: #eac220;
              }

              &.lose-effect {
                background: #bbbbbd;
              }

              &.blue {
                width: auto;
                // background: #fbafc6;
                background: rgba(1, 104, 193, .5);
              }
            }

            .new-title-desc {
              // display: flex;
              align-items: center;
              color: #ababab;
              font-size: 14px;
              // width: 750px;
              width: 100%;
              line-height: 1.8;

              .new-title-desc-left {
                display: flex;
                flex-wrap: wrap;

                div {
                  // width: 370px;
                  width: 50%;
                  height: 26px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  word-break: break-all;
                  box-sizing: border-box;
                  padding-right: 25px;
                }
              }
            }

            .title_desc {
              font-size: 14px;
              color: #999999;
              line-height: 1;
              // padding: 16px 0;
              @media screen and (max-width: 1440px) {
                // padding: 12px 0;
              }
            }

            .result_main_content {
              background: rgba($color: #0168c1, $alpha: .04);
              margin-top: 10px;

              .result_content_desc {
                padding: 10px 20px;
                color: #666;
                line-height: 28px;
                font-size: 14px;

                .result_content_desc_item {
                  margin-top: 5px;
                  display: flex;

                  .icon {
                    width: 5px;
                    height: 5px;
                    flex: 0 0 5px;
                    background: #ccc;
                    margin-right: 10px;
                    margin-top: 10px;
                  }
                }

                @media screen and (max-width: 1440px) {
                  padding: 8px 16px;
                  line-height: 24px;
                }
              }

              .count {
                display: flex;
                align-items: center;
                padding: 10px 20px;
                border-top: 1px dashed #ccc3c3;
                // 展开收起 20220103 by jing
                .fold {
                  margin-right: 40px;
                  font-size: 12px;
                  color: #0168c1;

                  .arrow-bottom {
                    border-top: 4px solid #0168c1;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    margin-left: 3px;
                    position: relative;
                    top: 8px;
                  }

                  .arrow-top {
                    border-bottom: 4px solid #0168c1;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    margin-left: 3px;
                    position: relative;
                    top: -8px;
                  }
                }

                .count_number {
                  display: flex;
                  align-items: center;
                  font-size: 14px;
                  color: #999;
                  display: flex;
                  align-items: center;

                  span {
                    color: #777;
                    padding: 0 5px;
                    cursor: pointer;

                    &:hover {
                      color: #0168c1;
                    }

                    &.disabled {
                      color: #ccc;
                      cursor: default;
                    }
                  }

                  .pagation_W {
                    margin-left: 20px;
                  }
                }
              }
            }
          }

          .result_item_title {
            padding: 10px 0 10px 0;
          }
        }
      }

      .no_result {
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        color: #131313;
        margin-top: 80px;

      }

      .pagination_wraper {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
      }

      .result_pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
      }
    }

    .result_right {
      //background-color: #ffffff;
      width: 200px;
      flex: 0 0 200px;
      //padding-top: 15px;
    }
  }

  .commonBg {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background: rgba(0, 0, 0, 0.5);
  }

  .slideUp-enter,
  .slideUp-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  .slideUp-enter-active,
  .slideUp-leave-active {
    transition: all 0.3s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s;
  }
}

.loading {
  text-align: center;
  font-size: 16px;
  color: #0168c1;
  height: 300px;
  padding-top: 100px;
}
</style>

<style lang="scss">
.tree_catalog_wraper {
  height: 100%;

  .el-tree-node {
    white-space: normal;

    .el-tree-node__content {
      height: 100%;
      line-height: 22px;
      align-items: start;
    }
  }
}
</style>
