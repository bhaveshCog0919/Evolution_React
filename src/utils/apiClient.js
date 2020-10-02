import axios from 'axios';
import i18n from "i18next";
import { apiBase } from './config';
import { getAccessToken } from './authenticate';

const instance = axios.create({
  baseURL: apiBase,
  // timeout: 60000
});

var headers = {
  'Content-Type': 'application/json',
  'Authorization': 'JWT fefege...',
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"*",
  'X-Requested-With': 'XMLHttpRequest'
}

//axios.defaults.headers.common['Authorization'] =sessionStorage.getItem("token");
const request = (method, url, data, isSilent) => {
  var loginUserLang = JSON.parse(localStorage.getItem('loggedInUserData'));
  // console.log("SDAf", getAccessToken())
    console.log("url", url)
    // console.log("isSilent", isSilent)
  if(data == undefined || data == ''){
    var setData = {
      PreferLang: (loginUserLang.PreferredLanguage == null ? 'en-IE' : loginUserLang.PreferredLanguage),
      CurrentUserId:((loginUserLang.EntityId == undefined || loginUserLang.EntityId == null)? 'System': loginUserLang.EntityId)

    };
    data = setData;
  }else{
    var pref='';
    data.PreferLang = pref;
    data.CurrentUserId = pref;
    // var setData = {
    //   PreferLang: (loginUserLang.PreferredLanguage == null ? 'en-IE' : loginUserLang.PreferredLanguage),
    //   CurrentUserId:((loginUserLang.EntityId == undefined || loginUserLang.EntityId == null)? 'System': loginUserLang.EntityId)

    // };
    // data = setData;
  console.log("loginUserLang", loginUserLang);
  
  if(loginUserLang != null){
    if(loginUserLang.PreferredLanguage == null){
         
      data.PreferLang = 'en-IE';
    }
    else{
      data.PreferLang = loginUserLang.PreferredLanguage;
    }
    if(loginUserLang.EntityId == undefined || loginUserLang.EntityId == null){
      data.CurrentUserId = 'System';  
      }
    else{
      data.CurrentUserId = loginUserLang.EntityId;
      }
  }
}
console.log("data..",data);
  headers['accept-language'] = i18n.language;
  headers['token'] = getAccessToken();
  let isaSilent = isSilent === undefined ? false : isSilent

  // instance.defaults.headers.common['Auth  orization'] = sessionStorage.getItem("token");
  if( url != 'api/getNotificationList' && url != 'api/getNotificationCount'){
    if (typeof isaSilent === "boolean" && isaSilent !== true) {
      let spinner = document.querySelector('.spinner');
      let logo = document.querySelector('.logo-img');
      spinner.classList.add('spinner-show');
      logo.classList.add('spinner-show');
    }
  }

  return new Promise((resolve, reject) => {
    (() => {
      if (method === 'get') {
        return instance.request({
          url, method, params: data, headers: headers
        });
      } else {
        return instance.request({
          url, method, data, headers: headers
        });
      }
    })()
      .then((res) => {
        // console.log(res);
        let spinner = document.querySelector('.spinner');
        let logo = document.querySelector('.logo-img');

        resolve(res.data);
        spinner.classList.remove('spinner-show');
        logo.classList.remove('spinner-show');
      })
      .catch((err) => {
        let spinner = document.querySelector('.spinner');
        let logo = document.querySelector('.logo-img');
        spinner.classList.remove('spinner-show');
        logo.classList.remove('spinner-show');
        reject(err.response);
      })
      ;
  });
};

export default {
  get: (endpoint, data, isSilent) => {
    return request('get', endpoint, data, isSilent);
  },
  post: (endpoint, data, isSilent) => {
    // return request('post', endpoint, JSON.stringify(data));
    return request('post', endpoint, data, isSilent);
  },
  put: (endpoint, data, isSilent) => {
    return request('put', endpoint, data, isSilent);
  },
  del: (endpoint, data, isSilent) => {
    return request('delete', endpoint, data, isSilent);
  },
};


