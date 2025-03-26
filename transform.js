const axios = require("axios");
const os = require("os")
const fs = require("fs")
const path = require("path")
const translate = require('google-translate-api');
inputDir = "./data/boyNames"
outputDir = "./data/transformedData/boyNames"

let langmap = {
    "hindi": "hi",
    "bengali": "bn",
    "marathi": "mr",
    "telugu": "te",
    "tamil": "ta",
    "gujarati": "gu",
    "kannada": "kn",
    "odia": "or",
    "malayalam": "ml",
    "punjabi": "pa"
}

let religionMap = {
    "hindu": "Hindu",
    "christian": "Christian",
    "islam": "Muslim",
    "muslim": "Muslim",
    "sikh": "Sikh",
    "christianity":"Christian"
}

let genderMap = {
    "boy":"male",
    "girl":"female"
}

function fixNasals(text) {
    const replacements = {
      // Fix misplaced anusvāra (ां → अं)
      'ां': 'अं',    // Example: "ांकिता" → "अंकिता"
      'िं': 'इं',    // Example: "किंता" → "किंता" (correct)
      'ीं': 'ईं',    // Example: "गीं" → "गईं"
      '़': '',        // Remove nukta (e.g., "क़" → "क")
    };
  
    let output = text;
    // Step 1: Fix misplaced nasal+vowel combos
    output = output.replace(/ां/g, replacements['ां'])
                  .replace(/िं/g, replacements['िं'])
                  .replace(/ीं/g, replacements['ीं'])
                  .replace(/़/g, replacements['़']);
    
    return output;
  }


async function getWordInLang(data, code) {
    const text = data;
    const language = code; 
    const url = `https://www.google.com/inputtools/request?text=${encodeURIComponent(
      text
    )}&itc=${language}-t-i0-und`;

    try {
        const resdata = await axios.get(url);
        if(resdata?.data[0] === "SUCCESS") {
            // console.log("transliteration success");
            return fixNasals(String(resdata.data[1][0][1])) // Return the transliterated text
        } else {
            // console.log("transliteration fail");
            return null;
        }
    } catch (error) {
        // console.error("Error in transliteration:", error);
        return null;
    }
}

async function translateText(text, targetLang) {
    const res = await translate(text, { to: targetLang });
    return res.text;
}
/*
{
    "recordid": "10babynameidd90279c9132",
    "babyname": "Aafa",
    "type": "",
    "meaning": "Forgiver",
    "numerology": 9,
    "gender": "Boy",
    "lengthofletters": 4,
    "startingwith": "A",
    "syllables": "2",
    "religion": "muslim",
    "origin": "NA",
    "rashi": "",
    "similarnames": "Zaafir,Haafiza,Ilaaf,Naafi,Saqaafa,Waafiyah,Zaafira,Afaaf,Afaafa,Zaafarani,Zaafirah,Abdulhaafiz,Abdulraafi,Altaaf,Daafi",
    "nakshatra": "",
    "viewcount": 639,
    "religionid": "1",
    "godid": "8",
    "originid": "284",
    "status": 1,
    "created_date": "2018-07-17T08:25:12.073Z",
    "updated_date": "2018-07-17T08:25:12.073Z",
    "god": "Muslim",
    "favouriteid": 0,
    "isShortlist": false
  }

  {
        "name": {
            "english": "Oormila",
            "telugu": "ఊర్మిల"
        },
        "first_letter": {
            "english": "Oo",
            "telugu": "ఊ"
        },
        "gender": "female",
        "language": "Telugu",
        "religion": "Hindu",
        "meanings": {
            "english": "Enchantress",
            "telugu": "మంత్రగత్తె"
        },
        "origin": "Sanskrit",
        "tags": [
            "charming",
            "attractive"
        ]
    }
*/

async function tranform(data){
    let tdata = {}
    tdata.name = {}
    tdata.first_letter = {}
    let nameInEnglish = data.babyname;
    tdata.name.english = nameInEnglish;
    tdata.first_letter.english = String(nameInEnglish).charAt(0);
    let gender = data.gender;
    let meaning = data.meaning;
    let religion = String(data.religion).toLocaleLowerCase();
    tdata.meanings = {}
    tdata.meanings.english = meaning;
    tdata.taga = []
    tdata.gender = genderMap[String(gender).toLowerCase()]
    if(religion.includes("muslim") || religion.includes("islam")){
        tdata.religion = "Hindu";
    }else if(religion.includes("muslim") || religion.includes("islam")){
        tdata.religion = "Muslim";
    }else if(religion.includes("christian")){
        tdata.religion = "Christian";
    }else if(religion.includes("sikh")){
        tdata.religion = "Sikh";
    }else{
        tdata.religion = "others";
    }
    
    if(!nameInEnglish || !gender || !religion){
        return null;
    }
    // populating name and first letter
    for (const key in langmap) {
        let lang = key;
        let langCode = langmap[lang]
        let trafWord = await getWordInLang(nameInEnglish,langCode)
        tdata.name[lang] = trafWord
        tdata.first_letter[lang] = String(trafWord).charAt(0);
        if(!trafWord){
            return null
        }
    }
    // console.log(tdata);
    return tdata;
}

// console.log(getWordInLang("hello","te"))

let tempdata = {
    "recordid": "10babynameidd90279c9132",
    "babyname": "ankita",
    "type": "",
    "meaning": "Forgiver",
    "numerology": 9,
    "gender": "Boy",
    "lengthofletters": 4,
    "startingwith": "A",
    "syllables": "2",
    "religion": "muslim",
    "origin": "NA",
    "rashi": "",
    "similarnames": "Zaafir,Haafiza,Ilaaf,Naafi,Saqaafa,Waafiyah,Zaafira,Afaaf,Afaafa,Zaafarani,Zaafirah,Abdulhaafiz,Abdulraafi,Altaaf,Daafi",
    "nakshatra": "",
    "viewcount": 639,
    "religionid": "1",
    "godid": "8",
    "originid": "284",
    "status": 1,
    "created_date": "2018-07-17T08:25:12.073Z",
    "updated_date": "2018-07-17T08:25:12.073Z",
    "god": "Muslim",
    "favouriteid": 0,
    "isShortlist": false
  }

//   tranform(tempdata);

async function main(){
    let files = fs.readdirSync(inputDir);
    for(const file of files){
        let filePath = inputDir + "/" + file;
        let outputFilePath = outputDir + "/" + file;
        let data = JSON.parse(fs.readFileSync(filePath,'utf-8'));
        let outputData = []
        for(let document of data){
            let tdocument = await tranform(document)
            if(tdocument != null){
                outputData.push(tdocument)
            }else{
                console.log("failed while processing a document")
            }
        }
        
        fs.writeFileSync(outputFilePath, JSON.stringify(outputData, null, 2), 'utf8');
        console.log(`processing done for file ${file}`);
    }
    // console.log(files)
}
main()