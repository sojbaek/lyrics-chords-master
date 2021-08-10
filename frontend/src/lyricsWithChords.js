const minorPattern = /(?!.*maj).*^[A-G][#b♭]?(m)+(\S)*/gm
const noteDic = { "C": 0,
                "C#": 1, "Db": 1,
                "D":2,
                "D#":3, "Eb":3,
                "E":4,
                "F":5,
                "F#":6,"Gb":6,
                "G":7,
                "G#":8,"Ab":8,
                "A":9,
                "A#":10,"Bb":10,
                "B":11}
const chordPattern = /^([A-G][#b+♭ØΔ]?([Ss]us|[mM]ajor|[Mm]inor|[Aa]ug|[Ss]us|[Mm]in|[Mm]aj|[Dd]im|[Mm])*([0-9\/\-\+♭ØΔ]|add)*)+$/mg
const majorDic = {"C": 0, "G": 1, "D": 2,
        "A":3,"E":4, "B":5,
     "F#":6, "Gb":6, "C#":7, "Db":7,
     "G#":8,"Ab":8,"D#":9,"Eb":9,
      "A#":10,"Bb":10,"F":11}
const minorDic = {"A": 0, "E": 1, "B": 2,
      "F#":3,"Gb":3, "C#":4, "Db":4,
   "G#":5, "Ab":5, "D#":6, "Eb":6,
   "A#":7,"Bb":7,"F":8,"C":9,
    "G":10,"D":11}

const majornoteArray = ['C','Db','D','Eb','E','F','F#','G','Ab','A','Bb','B']
const minornoteArray = ['C','C#','D','D#','E','F','F#','G','G#','A','Bb','B']
const majorkeyArray = ['C','G','D','A','E','B','F#','Db','Ab','Eb','Bb','F']
const minorkeyArray = ['A','E','B','F#','Db','Ab','Eb','Bb','F','C','G','D']

function LyricsWithChords(lyric) {
    this.ID = Math.random().toString(36).substr(2, 5)
    this.lyricID = "lyric" + this.ID
    this.keySelID = "keySel" + this.ID
    this.chordlistID = "chords" + this.ID
    this.lyric = lyric
    this.isFlat = false
    this.isminor = false
    this.songKey = "C"
    this.songKeyVal = 0
    this.chords = []
    this.chordsUsed = new Set();
    this.chordsList = []
    this.readChordFromString(this.lyric)
    this.findKeySignature()
}


function Chord(label, from, to) {
    this.label = label
    this.from = from
    this.to = to
    this.getKeys = function() {
        return(this.label.match(/(A#|Ab|A|Bb|B|C#|C|Db|D#|D|Eb|E|F#|F|Gb|G#|G)/gm)) 
    }
    this.isMinor = function() {
        return(!!this.label.match(minorPattern)) 
    }
    this.key = this.getKeys()[0]
}


const checkChord = function(str) {
  //  console.log(chordPattern)
  //  console.log(str)
    var mtch = str.match(chordPattern)
    var matchlength = (mtch == null) ? 0 : mtch[0].length
    return matchlength === str.length
}

const indicesWhiteSpaces = function (str) {
    var whitespaces = /[\s\.]/g;
    var pos=[]
    var match
    while ((match = whitespaces.exec(str)) != null) {
        pos.push(match.index)
    }
    return pos
}

LyricsWithChords.prototype.getTransposalKeys = function() {
    var keys = []
    for (var ii=0; ii<=12; ii++) {
        var key = (noteDic[this.songKey] + (ii-6)+12) % 12
        var keyname = (this.isminor ?  (minornoteArray[key]+"m") : majornoteArray[key]) + " (" + (ii-6) + ")"
        keys.push(keyname)
//        select.options[ii] = new Option(keyname ,ii-6);
    }
    return keys
}

LyricsWithChords.prototype.findKeySignature = function()  {
    var minorchordFreqs = new Array(12).fill(0);
    var majorchordFreqs = new Array(12).fill(0);
    const MAXCOMP = 30
    for (const x of this.chords.keys()) {
        var chord = this.chords[x]
        //console.log("[%s] / %s / %s", chord.label, chord.key, chord.isMinor())
        var chdkey  
        var isminor = chord.isMinor() 
        if (isminor) {
            chdkey =  minorDic[chord.key]
            minorchordFreqs[chdkey] += 1
            minorchordFreqs[(chdkey+1)%12] += 1
            minorchordFreqs[(chdkey+11)%12] += 1
        } else {
            chdkey =  majorDic[chord.key]
            majorchordFreqs[chdkey] += 1
            majorchordFreqs[(chdkey+1)%12] += 1
            majorchordFreqs[(chdkey+11)%12] += 1
        }        
        if (x > MAXCOMP) break
    }       

    var resultMaj = majorchordFreqs.indexOf(Math.max(...majorchordFreqs));
    var resultMin = minorchordFreqs.indexOf(Math.max(...minorchordFreqs));
    if (minorchordFreqs[resultMin]> majorchordFreqs[resultMaj]) {
        this.isminor = true
        this.songKeyVal = resultMin
        this.songKey = minorkeyArray[resultMin]
    } else {
        this.isminor = false
        this.songKeyVal = resultMaj
        this.songKey = majorkeyArray[resultMaj]
    }
    this.isFlat = this.songKeyVal > 6
    console.log("Key: %s %s", this.songKey, this.isminor ? "minor" : "" )
}

LyricsWithChords.prototype.readChordFromString = function(str) {
    var idTo = indicesWhiteSpaces(str).concat(str.length)
    var idFrom = [-1].concat(idTo)
    //  var str = str
    for (const x of idTo.keys()) {
        var lnth = idTo[x] - idFrom[x] 
        if (lnth > 1) {
            var token= str.slice(idFrom[x]+1, idTo[x])
            if (checkChord(token)) {
        //        console.log("token=" + token)
                this.chords.push(new Chord(token, idFrom[x]+1, idTo[x]-1))
                this.chordsUsed.add(token)
            }
        }
    } 
}

LyricsWithChords.prototype.transposeChord = function(ch, diff,isMinor) {
    var chordkeys = ch.getKeys()
    var newlabel = ""+ch.label
    var pos = 0
  //  var lastpos = 0
    //console.log("ch={%s}, diff={%s}, isMinor={%s}\n", ch, diff, isMinor)
    for (const x of chordkeys.keys()) {
        var newpos=newlabel.indexOf(chordkeys[x],pos = pos)
        var newkeyval=(noteDic[chordkeys[x]]+diff+12)%12
        var newkey = isMinor ?  minornoteArray[newkeyval] : majornoteArray[newkeyval]
      //  console.log("diff="+ diff)
        newlabel = newlabel.substr(0,newpos)+newkey+newlabel.substr(newpos+chordkeys[x].length);
        pos = newpos + newkey.length
    }
//  console.log("old chord={%s}, new one={%s}\n", ch.label, newlabel)
    return(new Chord(newlabel, ch.from, ch.from+newlabel.length-1))
}




LyricsWithChords.prototype.displayChords = function() {
    // var chordlistlength = this.chordsList.length;
    // if (chordlistlength  == 0) {
    //     for (const x of this.chordsUsed) {
    //         this.chordsList.push(new GChord(x));
    //     }
    // } else {
    //     let array = Array.from(this.chordsUsed);
    //     for (var ii= 0; ii < chordlistlength; ii++) {
    //         var chord = array[ii];
    //         this.chordsList[ii].setChord(chord);
    //     }
    // }    
}

LyricsWithChords.prototype.transpose = function(offset) {
    var newlyric = ""
    var pos = 0
    var inc = 0
    var self = this
    this.chordsUsed = new Set()
    this.chords.forEach(chord => {
        var newchord = LyricsWithChords.prototype.transposeChord(chord, offset,this.isminor)
        var addendum
     //   console.log("this.lyric=" + this.lyric)
        var fillin = this.lyric.substring(pos, chord.from)
        var hasReturn = fillin.indexOf("\n")
        if (hasReturn == -1) {
            fillin = this.lyric.substring(pos+inc, chord.from)
        }
        if (newchord.label.length >= chord.label.length) {
            addendum =  fillin + newchord.label
            inc = newchord.label.length - chord.label.length
        } else {
            addendum =  fillin + newchord.label + " ".repeat(chord.label.length - newchord.label.length)
            inc = 0
        }
        self.chordsUsed.add(newchord.label)
  //      console.log("[%s]",addendum)
        newlyric += addendum
        pos = chord.to + 1
    })
    newlyric += this.lyric.substring(pos)
   // console.log("new=" + newlyric)
    //document.getElementById(this.lyricID).textContent = newlyric
  //  this.displayChords()
    return newlyric.split('\n');
}

// function onKeyChanged() {
//   //  console.log("on Key Changed %s", this.value)
//     caller=keySelMap[this.id]
//     caller.transpose(parseInt(this.value))
// }

// const song = {"_id":{"$oid":"5e6757f02df37f3d54ddb179"},"title":"내 마음에 비친 내 모습","artist":"유재하","lyric":["A         Bm        E7        A","","Bm7           C#m7    F#7   Bm7     E7      A","붙들 수 없는 꿈의 조각들은    하나 둘 사라져 가고","Bm7        C#m7        F#7   Bm7   E7      A","쳇바퀴 돌듯 끝이 없는 방황에   오늘도 매달려 가네","Bm7   E7   C#m   F#7  Bm7   E7  A","거짓인줄   알면서도  겉으론   감추며","Bm7   E7   C#m   F#7         Bm7           E7","한숨 섞인 말 한마디에    나만의 진실 담겨 있 는듯","A      Bm7           E7      A","이제와 뒤늦게 무엇을 더 보태려 하나","F#m         Bm   Bm7       E7","귀 기울여 듣지 않고  달리보면 그만인 것을","A        Bm7            E7       A","못 그린 내 빈곳  무엇으로 채워 지려나","F#m   Fdim     Bm7     E7     A","차라리 내 마음에 비친   내 모습 그려 가리","Bm7        C#m   F#7   Bm7   E7       A","엇갈림속의  긴잠에서 깨면  주위엔 아무도 없고","Bm7          C#m         F#7   Bm7    E7       A","묻진 않아도  나는 알고 있는 곳   그 곳에 가려고 하네","Bm7  E7   C#m   F#7  Bm7  E7    A","근심 쌓인 순간들을     힘겹게 보내며","Bm7  E7   C#m   F#7        Bm7            E7","지워 버린 그 기억들을 생각 해내곤  또 잊어 버리고","A      Bm7           E7      A","이제와 뒤늦게  무엇을 더 보태려 하나","F#m       Bm    Bm7    E7","귀기울여 듣지 않고  달리보면 그만인 것을","A      Bm7           E7      A","못그린 내 빈곳 무엇으로 채워지려나","F#m   Fdim    Bm7    E7   A","차라리 내 마음에 비친 내 모습 그려가리","","Bm   E7   C#m  F#7   Bm7   E7   A  A7","Dm   G7  Em7   A7   Dm   G7","","C      Dm7            G       Cmaj7","이제와 뒤늦게 무엇을 더 보태려 하나","Am       Dm   Dm7     G7","귀기울여 듣지 않고 달리보면 그만인 것을","Cmaj7     Dm          G7       C","못그린 내 빈곳 무엇으로 채워 지려나","Am7   Abdim    Dm7    G7   Cmaj7","차라리 내 마음의 비친 내 모습 그려가리","","D7  G7    A"],"youtube":"https://www.youtube.com/embed/yPdUVGhmXWA","genre":"발라드","user_id":"0"}
// var lyrics = song["lyric"].join('\n');
// let test = new LyricsWithChords(lyrics)
// console.log("transposed=\n" + test.transpose(2))
// console.log("keys= " + test.getTransposalKeys())

export default LyricsWithChords;