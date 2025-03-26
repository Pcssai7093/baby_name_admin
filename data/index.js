const axios = require('axios');
const fs = require("fs");
const path = require("path");
let baseFolderName = "./girlNames"
let resumePage = 1;
let totalCount = 47642;
let pageSize = 100;
let data = {
  "gender": [
    "girl"
  ],
  "religion": [],
  "category": "",
  "keyword": "",
  "startwith": "",
  "endwith": "",
  "length": [
    "all"
  ],
  "numofletter": [
    "all"
  ],
  "origin": [
    "all"
  ],
  "numerology": [
    "all"
  ],
  "rashi": [
    "all"
  ],
  "nakshatra": [
    "all"
  ],
  "god": [
    "all"
  ],
  "pageNo": 1,
  "pageSize": 100,
  "sortkey": "Sort A to Z",
  "systemflag": "0",
  "startwithsearch": "",
  "endwithsearch": "",
  "IsTryingToConceive": 0
}

function getRandomUserAgent() {
    const agents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Mozilla/5.0 (X11; Linux x86_64; rv:89.0) Gecko/20100101 Firefox/89.0',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
      'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
    ];
    return agents[Math.floor(Math.random() * agents.length)];
  }
  
  function getRandomAcceptLanguage() {
    const languages = [
      'en-GB,en-US;q=0.9,en;q=0.8',
      'en-US,en;q=0.9',
      'en-GB,en;q=0.5',
      'en-AU,en;q=0.9',
      'en-CA,en;q=0.9'
    ];
    return languages[Math.floor(Math.random() * languages.length)];
  }
  
  function getRandomHeaders() {
    return {
      'accept': '*/*',
      'accept-language': getRandomAcceptLanguage(),
      'access-token': '5c624f03a3e6c81345f85aa7feea5f17c78adccad12e1bfd654a13a8b826cfb3d449da8e54d048063c1d66905bd05ba00694930c5ec7ed92ce2e1af7581479aa5887b21740a43efd970426ee55d86e24476b857397738bbc152130c5726ccbd4e09d0e3f66bd814ef8fd8c4daae8af878493e1d0322260ce01fc461a0723bb30ebc1d75895800a60286fcf44b949f7852d04df796084588a5c0bb72c2',
      'content-type': 'application/json',
      'ftk': '',
      'isdesktop': 'true',
      'origin': 'https://parenting.firstcry.com',
      'priority': 'u=1, i',
      'referer': 'https://parenting.firstcry.com/baby-names/girl/?ref2=bnalsoreadsection',
      'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
      'sec-ch-ua-mobile': Math.random() > 0.5 ? '?0' : '?1',
      'sec-ch-ua-platform': '"Chrome OS"',
      'uid': '1742892068',
      'user-agent': getRandomUserAgent(),
      'Cookie': 'ci_session=1b35c5uqin5333aqtsp77e72ca'
    };
  }
  
async function main(){
    while (resumePage * pageSize - pageSize < totalCount) {
      // Usage:
      data.pageNo = resumePage;
      data.pageSize = pageSize;
      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://parenting.firstcry.com/parenting/Babynames/getbabysearchbyfilters",
        headers: getRandomHeaders(),
        data: data,
      };
      let isFailed = false;
      try{
        const response = await axios.request(config);
        let responseData = response.data;
        
        if (responseData?.msg == "1") {
          console.log("retrieve success");
          handleApiResponse(responseData, resumePage);
        } else {
          console.log("retrieve failed");
          isFailed = true;
        }
      }
      catch(err){
        console.log(err);
        isFailed = true;
      }
      if(isFailed){
        console.log(`failed at page number ${resumePage}`)
      }
    
      resumePage +=1;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
}


function handleApiResponse(response,resumePage){
    let data = response.SearchData;
    const filePath = path.join(baseFolderName, `${resumePage}.json`);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`successfully writtent to file ${filePath}`)
}

main();