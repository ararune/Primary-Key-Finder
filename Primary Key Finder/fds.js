var brojFO = 1;
var atributi = new Array();
var lijevaStrana = new Array();
var desnaStrana = new Array();
var lhsIzvorna = new Array();
var rhsIzvorna = new Array();
var FminBroj = 0;
var kljucKandidatiNum = 0;
var kljucKandidati = new Array();


window.addEventListener("load", resetiraj);
window.addEventListener("load", ukloniZadnjuFO);

// Provjerava jesu li svi elementi FO atributi koji se nalaze unutar relacije, to jest je li FO podskup relacije
function valjanostUnosa(niz) {
	let checker = (atributi, niz) => niz.every(v => atributi.includes(v));
	if (!checker(atributi, niz)) {
		alert("Nevaljan unos! Provjerite da su svi atributi odvojeni razmakom, te da su svi atributi FO u relaciji");
		return false;
	}
	return true;
}

function resetiraj() {
	atributi, lijevaStrana, desnaStrana, lhsIzvorna, rhsIzvorna, kljucKandidati = new Array();

	if (kljucKandidatiNum % 2 == 1)
		pronadjiPK();
	kljucKandidatiNum = 0;

	document.getElementById('unos-atributa').value = "";
	for (var i = 1; i < brojFO; i++)
		brisiFO(i);
	brojFO = 1;
	unosFO();
}

function regEx() {
	atributi = new Array();
	lijevaStrana = new Array();
	desnaStrana = new Array();
	var string = document.getElementById('unos-atributa').value;
	var i = 0;
	// Filtriranje non-alpha znakova
	var isAlpha = function (ch) {
		return /^[A-Z]$/i.test(ch);
	}
	while (i < string.length) {
		var j = i;
		var temp = "";
		while (isAlpha(string[j]) && j < string.length) {
			temp += string[j];
			j++;
		}
		atributi.push(temp);

		while (!isAlpha(string[j]) && j < string.length)
			j++;
		i = j;
	}

	// Lijeva strana
	for (var k = 1; k < brojFO; k++) {
		if (document.getElementById("lhs" + k) == null)
			continue;
		var niz = new Array();
		i = 0;
		var string = document.getElementById("lhs" + k).value;
		while (i < string.length) {
			var j = i;
			var temp = "";
			while (isAlpha(string[j]) && j < string.length) {
				temp += string[j];
				j++;
			}
			niz.push(temp);
			while (!isAlpha(string[j]) && j < string.length)
				j++;
			i = j;
		}
		niz.sort();
		lijevaStrana.push(niz);
	}
	// Desna strana
	for (var k = 1; k < brojFO; k++) {
		if (document.getElementById("lhs" + k) == null)
			continue;
		var niz = new Array();
		i = 0;
		var string = document.getElementById("rhs" + k).value;
		while (i < string.length) {
			var j = i;
			var temp = "";
			while (isAlpha(string[j]) && j < string.length) {
				temp += string[j];
				j++;
			}
			niz.push(temp);
			while (!isAlpha(string[j]) && j < string.length)
				j++;
			i = j;
		}
		niz.sort();
		desnaStrana.push(niz);
	}

}

function unosFO() {
	var novaFO = "<span id = \"FO" + brojFO + "\">";
	novaFO += "<input type=\"text\" placeholder=\"Lijeva strana ovisnosti\"id=\"lhs" + brojFO + "\"><input type=\"text\" placeholder=\"Desna strana ovisnosti\" id=\"rhs" + brojFO + "\">";
	novaFO += "</span>"
	var container = document.createElement("div");
	container.innerHTML = novaFO;
	document.getElementById('unos-forma').appendChild(container);
	brojFO++;
}

function brisiFO(num) {
	document.getElementById("FO" + num).remove();
}
function ukloniZadnjuFO() {
	let i = 1;
	while (i < brojFO)
		i++;
	document.getElementById("FO").remove();
	brojFO--;
}


function getMinCover() {
	// nizovima atributi[], lijevaStrana[] i desnaStrana[] dodajemo vrijednosti 
	regEx();


	//Provjera i brisanje redundantnih FO 
	for (var i = 0; i < desnaStrana.length; i++) {
		for (var j = 0; j < desnaStrana[i].length; j++) {
			//provjera pojedinacnih atributa u desnaStrana[i][j]
			for (var k = 0; k < lijevaStrana[i].length; k++) {
				if (lijevaStrana[i][k] == desnaStrana[i][j]) {
					desnaStrana[i].splice(j, 1);
					j--;
					break;
				}
			}
		}
	}

	//Minimizacija lijeve strane za svaku FO
	//Provjeravamo svaki atribut u lijevoj strani FO; ako je prisutan u desnoj strani na odgovarajucem mjestu
	for (var i = 0; i < lijevaStrana.length; i++) {
		for (var j = 0; j < lijevaStrana[i].length; j++) {
			//Provjera za lijevaStrana[i][j]
			for (var k = 0; k < desnaStrana.length; k++) {
				if (lijevaStrana[k].length == lijevaStrana[i].length - 1) {
					var l;
					for (l = 0; l < desnaStrana[k].length; l++) {
						if (lijevaStrana[i][j] == desnaStrana[k][l])
							break;
					}
					if (l != desnaStrana[k].length) {
						//Projeravamo pojavljuju li se atributi lijevaStrana[i] u lijevaStrana[k]
						var sum = 0;
						for (var m = 0; m < lijevaStrana[i].length; m++) {
							for (var n = 0; n < lijevaStrana[k].length; n++) {
								if (lijevaStrana[i][m] == lijevaStrana[k][n])
									sum++;
							}
						}
						if (sum == lijevaStrana[i].length - 1) {
							lijevaStrana[i].splice(j, 1);
							j--;
							break;
						}
					}
				}
			}
		}
	}


	//Minimizacija lijeve strane FO

	for (var i = 0; i < desnaStrana.length; i++) {
		for (var j = 0; j < desnaStrana[i].length; j++) {
			//Provjeravamo da li se desnaStrana[i][j] ponavljaju
			var flag = true;
			for (var k = i + 1; k < desnaStrana.length && flag; k++) {
				for (var l = 0; l < desnaStrana[k].length; l++) {
					if (desnaStrana[i][j] == desnaStrana[k][l]) {
						//Ako je lhs[k] podskup lhs[i] brišemo rhs[i][j]  i obratno
						var sum = 0;
						for (var m = 0; m < lijevaStrana[i].length; m++) {
							for (var n = 0; n < lijevaStrana[k].length; n++) {
								if (lijevaStrana[i][m] == lijevaStrana[k][n])
									sum++;
							}
						}

						if (sum == lijevaStrana[k].length) {
							//brisanje lijevaStrana[i][j]
							desnaStrana[i].splice(j, 1);
							flag = false;
							break;
						}
						else if (sum == lijevaStrana[i].length) {
							//brisanje lijevaStrana[k][l]
							desnaStrana[k].splice(l, 1);
							break;
						}
					}
				}
			}
			if (flag == false)
				j--;
		}
	}


	//Za svaki atribut u lijevoj strani FO  provjeravamo je li prisutan u ogradi drugih atributa; ako je brisemo ga
	for (var i = 0; i < lijevaStrana.length; i++) {
		for (var j = 0; j < lijevaStrana[i].length; j++) {
			var tempNiz = lijevaStrana[i].slice();
			var att = lijevaStrana[i][j];
			tempNiz.splice(j, 1);
			var closure = getClosure(tempNiz, lijevaStrana, desnaStrana);
			for (var k = 0; k < closure.length; k++) {
				if (closure[k] == att) {
					lijevaStrana[i].splice(j, 1);
					j--;
					break;
				}
			}
		}
	}

	//Brisanje redundantnih FO koje proizlaze iz drugih FO
	//provjeravamo ostaje li nam ograda lijeve strane ista kada uklonimo FO te ukoliko je micemo ju

	for (var i = 0; i < lijevaStrana.length; i++) {
		for (var m = 0; m < desnaStrana[i].length; m++) {
			var tempLhsFO = [];
			var temp_fd_rhs = [];
			for (var j = 0; j < lijevaStrana.length; j++)
				tempLhsFO[j] = lijevaStrana[j].slice();
			for (var j = 0; j < desnaStrana.length; j++)
				temp_fd_rhs[j] = desnaStrana[j].slice();
			temp_fd_rhs[i].splice(m, 1);
			// ako se ograda lijevaStrana[i] sastoji od desnaStrana[i],  brisemo lijevaStrana[i]
			var closure = getClosure(lijevaStrana[i], tempLhsFO, temp_fd_rhs);

			var j;
			for (j = 0; j < desnaStrana[i].length; j++) {
				var k;
				for (k = 0; k < closure.length; k++) {
					if (closure[k] == desnaStrana[i][j])
						break;
				}
				if (k == closure.length)
					break;
			}
			if (j == desnaStrana[i].length) {
				desnaStrana[i].splice(m, 1);
				m--;
			}
		}
	}

}

function getClosure(lhs, tempLhsFO, temp_fd_rhs) {
	var closure = lhs.slice();
	var newRHS = true;
	while (newRHS) {
		newRHS = false;
		for (var i = 0; i < tempLhsFO.length; i++) {
			var inClosureLHS = true;
			for (var j = 0; j < tempLhsFO[i].length; j++) {
				var closureFlagLHS = false;
				for (var k = 0; k < closure.length; k++) {
					if (closure[k] == tempLhsFO[i][j]) {
						closureFlagLHS = true;
						break;
					}
				}
				if (closureFlagLHS == false) {
					inClosureLHS = false;
					break;
				}
			}
			if (inClosureLHS) {
				for (var j = 0; j < temp_fd_rhs[i].length; j++) {
					//ako desnaStrana[i][j]  nije u ogradi, dodajem u ogradu i oznacavamo newRHS kao 'true'
					var rhs_ij_in_closure = false;
					for (var k = 0; k < closure.length; k++) {
						if (closure[k] == temp_fd_rhs[i][j]) {
							rhs_ij_in_closure = true;
							break;
						}
					}
					if (rhs_ij_in_closure == false) {
						newRHS = true;
						closure.push(temp_fd_rhs[i][j]);
					}
				}
			}
		}
	}
	closure.sort();
	return closure;
}

function ispisiMinCover() {
	var field = "<fieldset>";
	field.border = "none";
	field += "<ul style=\"list-style-type:none\">";
	for (var i = 0; i < lijevaStrana.length; i++) {
		for (var j = 0; j < desnaStrana[i].length; j++) {
			field += "<li>"
			for (var k = 0; k < lijevaStrana[i].length; k++)
				field += lijevaStrana[i][k] + " ";
			field += "  ->  " + desnaStrana[i][j];
			field += "</li>";
		}
	}
	field += "</label>";
	field += "<div id = \"minimal_cover_steps_field\"></div>";
	field += "</fieldset><br>";

	document.getElementById("Fmin-field").innerHTML = field;

}


function getCandidates() {
	//Reset kljucKandidati[]
	kljucKandidati = new Array();


	var izvanRHS = new Array();	//Svaki kandidat će imat ove atribute
	//potentialKeysSet =  R-OnRHSNotOnLHS-ClosureSet(NotOnRHS)
	var potentialKeysSet = new Array();
	var ogradaBezRHS = new Array();	//Closure of izvanRHS set

	for (var i = 0; i < atributi.length; i++) {
		var in_rhs = false;
		for (var j = 0; j < desnaStrana.length && in_rhs == false; j++) {
			for (var k = 0; k < desnaStrana[j].length && in_rhs == false; k++) // Trazimo atribute koji se ne nalaze na destoj strani
			{

				if (desnaStrana[j][k] == atributi[i])
					in_rhs = true;
			}
		}
		if (in_rhs == false)
			izvanRHS.push(atributi[i]);
	}



	potentialKeysSet = atributi.slice();
	// Uklanjamo atribute iz funkcije (gdje spremamo kljuceve) koji su prisutni u funkciji closure(koji nisu na desnoj strani)
	for (var i = 0; i < potentialKeysSet.length; i++) {
		var j;
		for (j = 0; j < ogradaBezRHS.length; j++) {
			if (ogradaBezRHS[j] == potentialKeysSet[i]) // AKO SE NALAZI SAMO NA LIVOJ STRANI ( KOJI NISU NA DESNOJ STRANI)
				break;
		}
		if (j != ogradaBezRHS.length) {
			potentialKeysSet.splice(i, 1);
			i--;
		}
	}
	// Uklanjamo atribute iz funkcije (gdje spremamo kandidate kljuceva) koji su prisutni u desnoj a nisu na lijevoj strani
	for (var i = 0; i < potentialKeysSet.length; i++) {
		var in_lhs = false;
		var in_rhs = false;
		for (var j = 0; j < lijevaStrana.length && in_lhs == false; j++) {
			for (var k = 0; k < lijevaStrana[j].length && in_lhs == false; k++) {
				if (lijevaStrana[j][k] == potentialKeysSet[i])
					in_lhs = true;
			}
		}
		for (var j = 0; j < desnaStrana.length && in_rhs == false; j++) {
			for (var k = 0; k < desnaStrana[j].length && in_rhs == false; k++) {
				if (desnaStrana[j][k] == potentialKeysSet[i])
					in_rhs = true;
			}
		}
		if (in_rhs == true && in_lhs == false) {
			potentialKeysSet.splice(i, 1);
			i--;
		}
	}

	var closure = getClosure(izvanRHS, lijevaStrana, desnaStrana);
	if (closure.length == atributi.length)		//izvanRHS je jedini kandidat
		kljucKandidati.push(izvanRHS);
	else 		//uzimamo kandidate kljuceva iz funkcije koji nisu na desnoj strani i funkciju potencijalni spremljeni kljucevi
		traziKandidata(potentialKeysSet, izvanRHS, izvanRHS);

	//Imamo sve kljuceve za kandidate te sortiramo i brisemo prazne (kljuceve kandidate)
	for (var i = 0; i < kljucKandidati.length; i++) {
		if (kljucKandidati[i].length == 0) {
			kljucKandidati.splice(i, 1);
			i--;
			continue;
		}
		kljucKandidati[i].sort();
	}

	//Brisemo duplikate kandidiranih kljuceva (kljucKandidati[])
		for (var i = 0; i < kljucKandidati.length; i++) {
			for (var j = i + 1; j < kljucKandidati.length; j++) {
				var k = 0;
				for (k = 0; k < kljucKandidati[i].length && k < kljucKandidati[j].length; k++) {
					if (kljucKandidati[i][k] != kljucKandidati[j][k])
						break;
				}
				if (kljucKandidati[i].length == kljucKandidati[j].length && k == kljucKandidati[i].length) {
					kljucKandidati.splice(j, 1);
					j--;
				}
			}
		}


}
//  Trazanje kandidata
function traziKandidata(potentialKeysSet, key, izvanRHS) {
	for (var i = 0; i < potentialKeysSet.length; i++) {
		var tempKljucevi = key.slice();
		tempKljucevi.push(potentialKeysSet[i]);
		var closure = getClosure(tempKljucevi, lijevaStrana, desnaStrana);
		if (closure.length == atributi.length)	//provjera je li kljuc postaje super kljuc
		{

			var kandidatFlag = true;
			//provjera je li kljuc kandidat za kljuc
			for (var j = 0; j < tempKljucevi.length; j++) {
				var in_notrhs = false;
				for (var k = 0; k < izvanRHS.length && in_notrhs == false; k++) {
					if (izvanRHS[k] == tempKljucevi[j])
						in_notrhs = true;
				}
				if (in_notrhs == false && tempKljucevi[j] != potentialKeysSet[i]) {
					var tempNiz = tempKljucevi.slice();
					tempNiz.splice(j, 1);
					var temp_closure = getClosure(tempNiz, lijevaStrana, desnaStrana);
					if (temp_closure.length == atributi.length) {
						kandidatFlag = false;
						break;
					}
				}
			}
			if (kandidatFlag) {
				kljucKandidati.push(tempKljucevi);
			}
		}
		else {
			var new_key_store = potentialKeysSet.slice();
			new_key_store.splice(i, 1);
			traziKandidata(new_key_store, tempKljucevi, izvanRHS);
		}
	}

}

function pronadjiPK() {
	if (kljucKandidatiNum % 2 == 0) {
		getMinCover();
		for (var i = 0; i < lijevaStrana.length; i++) {
			if (!valjanostUnosa(lijevaStrana[i].slice()) || !valjanostUnosa(desnaStrana[i].slice()))
				return;
		}
		getCandidates();
		ispisiKandidate();
	}
	else {
		document.getElementById("KandidatiField").innerHTML = "";
	}
	kljucKandidatiNum++;

}

function ispisiKandidate() {
	var field = "<fieldset>";
	field += "Ključevi";

	for (var i = 0; i < kljucKandidati.length; i++) {
		field += "<li>"
		for (var j = 0; j < kljucKandidati[i].length; j++)
			field += kljucKandidati[i][j] + " ";
		field += "</li>";
	}

	document.getElementById("KandidatiField").innerHTML = field;
}

const bazaPrimjera = {
	primjer1: {
		R: "A B C D E F G H I J",
		FO: [{ lhs: "A", rhs: "B C D" },
		{ lhs: "D", rhs: "E F I" },
		{ lhs: "I", rhs: "G H" },
		{ lhs: "H", rhs: "J" },
		{ lhs: "J", rhs: "B D F" },
		{ lhs: "B", rhs: "E H" },
		{ lhs: "C", rhs: "I" }]
	},

	primjer2: {
		R: "A B C D E F G H I J",
		FO: [{ lhs: "A", rhs: "B D" },
		{ lhs: "E", rhs: "G H" },
		{ lhs: "B", rhs: "J" },
		{ lhs: "J", rhs: "A" },
		{ lhs: "D", rhs: "B E" },
		{ lhs: "B G", rhs: "H" },
		{ lhs: "E J", rhs: "G" }]
	},

	primjer3: {
		R: "A B C D E F G H I J",
		FO: [{ lhs: "A", rhs: "D" },
		{ lhs: "A G", rhs: "B" },
		{ lhs: "B", rhs: "G" },
		{ lhs: "B", rhs: "E" },
		{ lhs: "E", rhs: "F" },
		{ lhs: "E", rhs: "B" },
		{ lhs: "H", rhs: "I J" },
		{ lhs: "D", rhs: "E J" },
		{ lhs: "F", rhs: "H I" }]
	},
	primjer4: {
		R: "A B C D E F G H I J",
		FO: [{ lhs: "A", rhs: "I" },
		{ lhs: "B", rhs: "G" },
		{ lhs: "G", rhs: "E H" },
		{ lhs: "C", rhs: "D H" },
		{ lhs: "E", rhs: "B" },
		{ lhs: "I", rhs: "J G" },
		{ lhs: "H", rhs: "C" },
		{ lhs: "A I", rhs: "G" },
		{ lhs: "I", rhs: "A" }]
	},

	primjer5: {
		R: "A B C D E F G H I J",
		FO: [{ lhs: "D", rhs: "C" },
		{ lhs: "A B", rhs: "F" },
		{ lhs: "A F", rhs: "G H" },
		{ lhs: "G H", rhs: "E" },
		{ lhs: "E", rhs: "A I" },
		{ lhs: "I", rhs: "B C D" },
		{ lhs: "H", rhs: "A C E G I" },]
	},
}

function ucitajPrimjer(key) {
	resetiraj();
	const primjer = bazaPrimjera[key];

	document.getElementById('unos-atributa').value = primjer.R

	primjer.FO.forEach((fo, i) => {
		document.getElementById(`lhs${i + 1}`).value = fo.lhs;
		document.getElementById(`rhs${i + 1}`).value = fo.rhs
		if (i < (primjer.FO.length - 1))
			unosFO();
	})

}
