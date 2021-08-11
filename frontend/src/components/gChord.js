
//$(document).ready(function () {
	let xmargin = 6
	let ymargin = 5
	let bottommargin = 2
	let xlabw = 8
	let ylabw = 13
	let numfret = 4
	let LINEWIDTH = .75
	let CHORDWIDTH = 50
	let CHORDHEIGHT= 60
	let xstep = (CHORDWIDTH - 2*xmargin-xlabw) / 5.0;
	let ystep = (CHORDHEIGHT - 2*ymargin-ylabw-bottommargin) / numfret;
	var canvasID = 0
	
	var chordDict = {
		"Ab":"466544",    "Abm":"466444",    "Ab6":"431111",    "Ab7":"xx1112",    "Ab9":"xx1312",    "Abm6":"xxx444",    "Abm7":"xx1102",    "Abmaj7":"xx1113",    "Abdim":"xx0101",    "Ab+":"x2110",    "Absus":"xx1124","Absus4":"xx1124",
		"A":"x02220",    "Am":"x02210",    "A6":"x02222",    "A7":"x02223",    "A9":"x02423",    "Am6":"x02212",    "Am7":"x02213",    "Amaj7":"x02120",    "Adim":"xx1212",    "A+":"x03221",    "Asus":"x02230","Asus4":"x02230",
		"A#":"x13331",    "A#m":"x13321",    "A#6":"113333",    "A#7":"xx3334",    "A#9":"335333",    "A#m6":"xx3323",    "A#m7":"xx3324",    "A#maj7":"x1323x",    "A#dim":"xx2323",    "A#+":"xx0332",    "A#sus":"xx3341","A#sus4":"xx3341",
		"Bb":"x13331",    "Bbm":"x13321",    "Bb6":"113333",    "Bb7":"xx3334",    "Bb9":"335333",    "Bbm6":"xx3323",    "Bbm7":"xx3324",    "Bbmaj7":"x1323x",    "Bbdim":"xx2323",    "Bb+":"xx0332",    "Bbsus":"xx3341","Bbsus4":"xx3341",
		"B":"x24442",    "Bm":"x24432",    "B6":"224444",    "B7":"x21202",    "B9":"x21222",    "Bm6":"xx4434",    "Bm7":"x24232",    "Bmaj7":"x2434x",    "Bdim":"xx0101",    "B+":"xx5443",    "Bsus":"xx4452","Bsus4":"xx4452",
		"C":"332010",    "Cm":"x35543",    "C6":"xx2213",    "C7":"x32310",    "C9":"x32333",    "Cm6":"xx1213",    "Cm7":"xx1313",    "Cmaj7":"x32000",    "Cdim":"xx1212",    "C+":"xx2110",    "Csus":"xx3013","Csus4":"xx3013",
		"C#":"xx3121",    "C#m":"xx2120",    "C#6":"xx3324",    "C#7":"xx3424",    "C#9":"x43444",    "C#m6":"xx2324",    "C#m7":"xx2424",    "C#maj7":"x43111",    "C#dim":"xx2323",    "C#+":"xx3221",    "C#sus":"xx3341","C#sus4":"xx3341",
		"Db":"xx3121",    "Dbm":"xx2120",    "Db6":"xx3324",    "Db7":"xx3424",    "Db9":"x43444",    "Dbm6":"xx2324",    "Dbm7":"xx2424",    "Dbmaj7":"x43111",    "Dbdim":"xx2323",    "Db+":"xx3221",    "Dbsus":"xx3341","Dbsus4":"xx3341",
		"D":"x00232",    "Dm":"x00231",    "D6":"x00202",    "D7":"x00212",    "D9":"200210",    "Dm6":"x00201",    "Dm7":"x00211",    "Dmaj7":"x00222",    "Ddim":"x00101",    "D+":"x00332",    "Dsus":"x00233","Dsus4":"x00233",
		"D#":"xx5343",    "D#m":"xx4342",    "D#6":"xx1313",    "D#7":"xx1323",    "D#9":"111321",    "D#m6":"xx1312",    "D#m7":"xx1322",    "D#maj7":"xx1333",    "D#dim":"xx1212",    "D#+":"xx1003",    "D#sus":"xx1344","D#sus4":"xx1344",
		"Eb":"xx5343",    "Ebm":"xx4342",    "Eb6":"xx1313",    "Eb7":"xx1323",    "Eb9":"111321",    "Ebm6":"xx1312",    "Ebm7":"xx1322",    "Ebmaj7":"xx1333",    "Ebdim":"xx1212",    "Eb+":"xx1003",    "Ebsus":"xx1344","Ebsus4":"xx1344",
		"E":"022100",    "Em":"022000",    "E6":"022120",    "E7":"022130",    "E9":"020102",    "Em6":"022020",    "Em7":"020000",    "Emaj7":"021100",    "Edim":"xx2323",    "E+":"xx2110",    "Esus":"022200","Esus4":"022200",    
		"F":"133211",    "Fm":"133111",    "F6":"xx0211",    "F7":"131211",    "F9":"xx3243",    "Fm6":"xx0111",    "Fm7":"131111",    "Fmaj7":"xx3210",    "Fdim":"xx0101",    "F+":"xx3221",    "Fsus":"xx3311","Fsus4":"xx3311",
		"F#":"244322",    "F#m":"244222",    "F#6":"x4434x",    "F#7":"xx4320",    "F#9":"xx4354",    "F#m6":"xx1222",    "F#m7":"xx2222",    "F#maj7":"xx4321",    "F#dim":"xx1212",    "F#+":"xx4332",    "F#sus":"xx4422","F#sus4":"xx4422",
		"Gb":"244322",    "Gbm":"244222",    "Gb6":"x4434x",    "Gb7":"xx4320",    "Gb9":"xx4354",    "Gbm6":"xx1222",    "Gbm7":"xx2222",    "Gbmaj7":"xx4321",    "Gbdim":"xx1212",    "Gb+":"xx4332",    "Gbsus":"xx4422","Gbsus4":"xx4422",
		"G":"320003",    "Gm":"355333",    "G6":"320000",    "G7":"320001",    "G9":"300201",    "Gm6":"xx2333",    "Gm7":"353333",    "Gmaj7":"xx5432",    "Gdim":"xx2323",    "G+":"xx1003",    "Gsus":"xx0013","Gsus4":"xx0013",
		"G#":"466544",    "G#m":"466444",    "G#6":"431111",    "G#7":"xx1112",    "G#9":"xx1312",    "G#m6":"xxx444",    "G#m7":"xx1102",    "G#maj7":"xx1113",    "G#dim":"xx0101",    "G#+":"x2110",    "G#sus":"xx1124","G#sus4":"xx1124"}
	
	function GChord(chord) {
		this.init = function() {
			console.log("init()")
				this.ID = "chord" + canvasID
				canvasID += 1
				document.write('<canvas class="canvas" width="'+CHORDWIDTH + '" height="'+CHORDHEIGHT + '" id="' + this.ID +'"></canvas>')
		}
		this.setChord = function(chord) {
			this.label = chord
			this.chordstr = chordDict[chord]
			var ctx = document.getElementById(this.ID).getContext("2d")
			drawChord(ctx, this.label, this.chordstr)
		}
		this.init()
		this.setChord(chord)
	}
	
	function drawChord(cx, chordlabel, chordstr) {
		let height = cx.canvas.height
		let width = cx.canvas.width
		cx.imageSmoothingEnabled = false;
		cx.strokeStyle = "black";
		cx.lineWidth = LINEWIDTH;
		cx.clearRect(0, 0, width, height);
		//chordlabel = chordlabel.replace("b","♭")
		if (chordstr == undefined) {
		chordstr = "      "
		}
	
		var posx = [];
		var posy = [];
	
		var basefret = 10;
		var maxfret = 0;
		for (var ii= 0; ii < chordstr.length; ii++) {
			var chr= chordstr.charAt(ii);
			var fret = parseInt(chr);
			if (isNaN(fret)) 
			fret = 0
			else {
				if (fret < basefret+1)
				basefret = fret - 1
				if (fret > maxfret)
				maxfret = fret
			}
		}
		if (basefret < 0 || maxfret <= 4) {
			basefret = 0;
		}
		var textsize
		fonts = ["18px serif", "16px serif", "12px serif", "10px serif","8px serif"];
		for (let font of fonts) {
		console.log("font=", font)
		cx.font = font
		textsize = cx.measureText(chordlabel);
		if (textsize.width < width)
			break
		}
		console.log("textsize=", textsize)
		cx.fillText(chordlabel, (width - textsize.width)/2, ylabw);
		
		for (let ii of Array(6).keys()) {
			cx.beginPath();
			cx.moveTo(xmargin+ii*xstep, 2*ymargin+ylabw);
			cx.lineTo(xmargin+ii*xstep, height-bottommargin);
			cx.stroke();
			posx.push(xmargin+ii*xstep)
			console.log(ii)
		}
	
		for (let ii of Array(numfret+1).keys()) {
		if (ii == 0 && basefret == 0) 
			cx.lineWidth = 2*LINEWIDTH
		else 
			cx.lineWidth = LINEWIDTH
		cx.beginPath();
		cx.moveTo(xmargin,  2*ymargin+ylabw+ii*ystep);
		cx.lineTo(width-xmargin-xlabw, 2*ymargin+ylabw+ii*ystep);
		cx.stroke();
		if (ii==0) {
			posy.push(ymargin + ylabw)
		} else {
			posy.push(2*ymargin+ylabw+(ii-0.5)*ystep)
		}
		console.log(ii)
		}
		
		console.log("max fret=", maxfret,"  base fret=",basefret)
		for (var ii= 0; ii < chordstr.length; ii++) {
			var chr= chordstr.charAt(ii);
			var fret = parseInt(chr);
			if (isNaN(fret)) 
			fret = 0
			var px = posx[ii];
			fret = fret - basefret;
			if (fret < 0)
			fret = 0
			var py = posy[fret];
			
			cx.beginPath();
			if (fret > 0) {
			cx.arc(px, py, xstep/2.0,0,7);
			cx.fill();
			} else {
			if (chr == "x") {
			cx.strokeStyle = "red";                    
			cx.moveTo(px - xstep/2.0, py - xstep/2.0);      cx.lineTo(px + xstep/2.0, py + xstep/2.0);
			cx.moveTo(px + xstep/2.0, py - xstep/2.0);      cx.lineTo(px - xstep/2.0, py + xstep/2.0);
			cx.stroke()
			cx.strokeStyle = "black";
			} else if (chr != " ") { 
			cx.arc(px, py, xstep/2.0,0,7);
			cx.stroke();
			}
		}    
		}
	
		if (basefret > 0) {
		cx.font = "11px Arial";
		cx.fillText(basefret+1, posx[5]+xstep*.75, posy[1]+xstep*.5)
		}
	}
	