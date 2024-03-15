import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// export default () => new Vuex.Store({})
export default () => new Vuex.Store({
  state: {
    // hasLogin: localStorage.getItem('hasLogin') || false,
    // userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : '',
    // token: localStorage.getItem('token') || '',
    // isRemember:localStorage.getItem('isRemember') || false,
    //
    // keyWord: [],
    // timeLinessList:'',
    // EffecLevel: '',
    // PulishOffice: '',
    //
    //
    // orderBy: '',
    // direction:'',
    //
    // resultKeyWords: localStorage.getItem('resultKeyWords') || null,

    hasLogin:  false,
    userInfo: '',
    token: '',
    isRemember: false,

    keyWord: [],
    timeLinessList:'',
    EffecLevel: '',
    PulishOffice: '',


    orderBy: '',
    direction:'',

    resultKeyWords: null,


    // 这个变量是标题搜索或全文搜索
    // search_fw_current: localStorage.getItem('search_fw_current') || 0,


    keyWordSubmit: {
      effecLevelId: '', // 效力级别,
      timeLinessID: '', // 时效性,
      publishOfficeId: '', // 发布机关,

      // publishDateId: '', //发布时间

      // causeActionId: '', // 案由,
      // referenceLevelId: '', // 参照级别,
      // trialCourtId: '', // 审理法院,
      // trialProcedureId: '', // 审理程序,
      // courtHierarchyId: '', // 法院层级,
      // textType: '', // 文书类型,
      // textType:'',//文书类型
      // yearConclusionId: '', // 审结年份,
      //
      // fieldId: '', // 领域,
      // categoryId: '', // 类别,
      // signTimeId: '', // 签订年份,
      //
      // effecLevelEnglishId: '', // 效力级别,
      // timeLinessEnglishId: '', // 时效性,
      // publishOfficeEnglishId: '', //发布机关
      // publishDateEnglishId: '' //发布日期
      },

    // 自己新写的搜索逻辑
    // searchParams:{
    //   keyword_title:"",        //关键词
    //   keyword_fulltext:"",
    //
    //   // keyword:"",
    //   // search_field:0,
    //   sort_type:"",
    //   sort_direction:"",
    //   // search_field:0,      //搜全文或标题
    //   effecLevel_code:"",      //效力级别代码
    //   publishOffice_code:"",   //发布机关代码
    //   timeLiness_code:""       //时效性代码
    // },

    homeSearchParam:{
      keyword_title:"",
      keyword_content:"",
      keyword:"",
      search_field:0,
      search_resource:0
    },

  },
  mutations: {
    isRememberChange(state,data){
      state.isRemember = data;
      localStorage.setItem('isRemember',data)
    },
    login(state, provider) {
      state.userInfo = provider

      localStorage.setItem('userInfo', JSON.stringify(provider))

    },
    logout(state) {
      state.hasLogin = false;
      state.userInfo = "";
      state.token = "";
      localStorage.setItem('hasLogin', '');
      localStorage.setItem('userInfo', '');
      localStorage.setItem('token', '');
    },
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
      state.hasLogin = true;
      localStorage.setItem('hasLogin', true)
    },

    setKeyWord(state, data) {
      state.keyWord = JSON.parse(JSON.stringify(data))
    },


    clearAllKeyWord(state, data) {
      state.keyWordSubmit.effecLevelId = data;
      state.keyWordSubmit.timeLinessID = data;
      state.keyWordSubmit.publishOfficeId = data;

      // state.keyWordSubmit.publishDateId = data;

      // state.keyWordSubmit.causeActionId = data;
      // state.keyWordSubmit.referenceLevelId = data;
      // state.keyWordSubmit.trialCourtId = data;
      // state.keyWordSubmit.trialProcedureId = data;
      // state.keyWordSubmit.courtHierarchyId = data;
      // state.keyWordSubmit.textType = data;
      // state.keyWordSubmit.yearConclusionId = data;

      // state.keyWordSubmit.fieldId = data;
      // state.keyWordSubmit.categoryId = data;
      // state.keyWordSubmit.signTimeId = data;

      // state.keyWordSubmit.effecLevelEnglishId = data;
      // state.keyWordSubmit.publishOfficeEnglishId = data;
      // state.keyWordSubmit.timeLinessEnglishId = data;
      // state.keyWordSubmit.publishDateEnglishId = data;
    },
    setKeywordsSubmit(state, data) {
      if (data.dictType == "EffecLevel") {
        state.keyWordSubmit.effecLevelId = data.dictCode;
      }
      if (data.dictType == "TimeLiness") {
        state.keyWordSubmit.timeLinessID = data.dictCode;
      }
      if (data.dictType == "PulishOffice") {
        state.keyWordSubmit.publishOfficeId = data.dictCode;
      }

      // if (data.dictType == "PulishDate") {
      //   state.keyWordSubmit.publishDateId = data.dictCode;
      // }
      //
      // if (data.dictType == "CauseOfAction") {
      //   state.keyWordSubmit.causeActionId = data.dictCode;
      // }
      // if (data.dictType == "ReferenceLevel") {
      //   state.keyWordSubmit.referenceLevelId = data.dictCode;
      // }
      // if (data.dictType == "TrialCourt") {
      //   state.keyWordSubmit.trialCourtId = data.dictCode;
      // }
      // if (data.dictType == "TrialProcedure") {
      //   state.keyWordSubmit.trialProcedureId = data.dictCode;
      // }
      // if (data.dictType == "textType") {
      //   state.keyWordSubmit.textType = data.dictCode;
      // }
      // if (data.dictType == "CourtHierarchy") {
      //   state.keyWordSubmit.courtHierarchyId = data.dictCode;
      // }
      // if (data.dictType == "YearOfConclusion") {
      //   state.keyWordSubmit.yearConclusionId = data.dictCode;
      // }
      //
      // //
      // if (data.dictType == "Field") {
      //   state.keyWordSubmit.fieldId = data.dictCode;
      // }
      // if (data.dictType == "Category") {
      //   state.keyWordSubmit.categoryId = data.dictCode;
      // }
      // if (data.dictType == "YearOfSigning") {
      //   state.keyWordSubmit.signTimeId = data.dictCode;
      // }
      //
      // if (data.dictType == "EffecLevelEnglish") {
      //   state.keyWordSubmit.effecLevelEnglishId = data.dictCode;
      // }
      // if (data.dictType == "PulishOfficeEnglish") {
      //   state.keyWordSubmit.publishOfficeEnglishId = data.dictCode;
      // }
      // if (data.dictType == "TimeLinessEnglish") {
      //   console.log(data)
      //   state.keyWordSubmit.timeLinessEnglishId = data.dictCode;
      // }
      // if (data.dictType == "PulishDateEnglish") {
      //   state.keyWordSubmit.publishDateEnglishId = data.dictCode;
      // }
    },
    setState(state, data) {
      if(data.type == 'TimeLiness'){
        state.timeLinessList = data.data
      }
      if (data.type == 'EffecLevel') {
        state.EffecLevel = data.data;
        // console.log(data)
      }
      if (data.type == 'PulishOffice') {
        state.PulishOffice = data.data
      }

      // if (data.type == 'PulishDate') {
      //   state.PulishDate = data.data
      // }
      // if (data.type == 'CauseOfAction') {
      //   state.CauseOfAction = data.data
      // }
      // if (data.type == 'ReferenceLevel') {
      //   state.ReferenceLevel = data.data
      // }
      // if (data.type == 'TrialCourt') {
      //   state.TrialCourt = data.data
      // }
      // if (data.type == "TrialProcedure") {
      //   state.TrialProcedure = data.data
      // }
      // if (data.type == "CourtHierarchy") {
      //   state.CourtHierarchy = data.data
      // }
      // if (data.type == "YearOfConclusion") {
      //   state.YearOfConclusion = data.data
      // }
      // if (data.type == "Field") {
      //   state.Field = data.data
      // }
      // if (data.type == "Category") {
      //   state.Category = data.data
      // }
      // if (data.type == "YearOfSigning") {
      //   state.YearOfSigning = data.data
      // }
      //
      // if (data.type == "EffecLevelEnglish") {
      //   state.EffecLevelEnglish = data.data
      // }
      // if (data.type == "PulishOfficeEnglish") {
      //   state.PulishOfficeEnglish = data.data
      // }
      // if (data.type == "PulishDateEnglish") {
      //   state.PulishDateEnglish = data.data
      // }
      // if (data.type == "timeLinessEnglish") {
      //   state.timeLinessEnglishId = data.data
      // }
    },
    setOrderBy(state, data) {
      state.orderBy = data
    },
    setDirection(state, data) {
      state.direction = data
    },
    setresultKeyWords(state, data) {
      localStorage.setItem('resultKeyWords', data)
      state.resultKeyWords = data || ' '
    },
    setresultTypes(state, data) {
      localStorage.setItem('resultTypes', data)
      state.resultTypes = data
    },
    // setsearch_fw_current(state, data) {
    //   localStorage.setItem('search_fw_current', data)
    //   state.search_fw_current = data
    // }
  },
  actions: {
    logout(state) {
      state.hasLogin = false;
      state.userInfo = "";
      state.token = "";
      localStorage.setItem('hasLogin', '');
      localStorage.setItem('userInfo', '');
      localStorage.setItem('token', '');
    },
  }
})
