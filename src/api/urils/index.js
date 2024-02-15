// 工具类函数 按理应放在utils中

export function getData(arr,data){
  for(let k in arr){
    if(arr[k].dictCode == data.dictCode){
      arr[k].children = data.children;
      break;
    }else{
      getData(arr[k].children,data)
      // for(let i in arr[k].children){
      //   if(arr[k].children[i].dictCode==data.dictCode){
      //     arr[k].children[i].children = data.children;
      //     break;
      //   }else{
      //     getData(arr[k].children[i],data)
      //   }
      // }
    }
  }
}
export function getDataChangeChild(arr,id){
  for(let k in arr){
    if(arr[k].dictCode ==id){
      arr[k].hasChild = false
      break;
    }else{
      getDataChangeChild(arr[k].children,id)
      // for(let i in arr[k].children){
      //   if(arr[k].children[i].dictCode==id){
      //     arr[k].children[i].hasChild = false;
      //     break;
      //   }else{
      //     getDataChangeChild(arr[k].children[i],id)
      //   }
      // }
    }
  }
}
//
export function limitKeyWords(arr,data){
  for(let k in arr){
    if(arr[k].dictType == data.dictType){
      arr[k].dictLabel = data.dictLabel
      return true
    }
  }
}

export default {
  getData,
  getDataChangeChild,
  limitKeyWords
}
