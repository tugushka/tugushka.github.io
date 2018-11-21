var n, m, score, prevInd;
var used;
var possibleMoves = [];
function reset(){
	n = Number(document.querySelector("#n").value);
	m = Number(document.querySelector("#m").value);
	if( n*m == 0 ){
		document.querySelector("#msg").innerHTML = "Invalid values";
		return;
	}

	used = {};
	score = 0;
	prevInd = -1;
	possibleMoves = [];

	console.log(n, m);
	board = document.querySelector("#board");
	if( board.querySelector("table") != null )
		board.removeChild( board.querySelector("table") );

	table = document.createElement("table");
	
	for(var i = 0 ; i < n ; i++){
		row = document.createElement("tr");
		for(var j = 0 ; j < m ; j++){
			var now = i * m + j;
			var id = 'c' + now;
			used[now] = 0;

			col = document.createElement("td");
			btn = document.createElement("div");
			btn.style.borderStyle = "solid";
			btn.style.height = "50px";
			btn.style.width = "50px";
			btn.id = id;

			col.appendChild(btn);
			row.appendChild(col);
		}
		table.appendChild(row);
	}
	board.appendChild(table);

	for(var i = 0 ; i < n ; i++){
		for(var j = 0 ; j < m ; j++){
			now = i*m+j;
			node = document.querySelector( "#c" + now );
			node.addEventListener( "click", transit );
		}
	}

	if( document.querySelector("#random").checked == true ){
		update( "c" + Math.floor( Math.random()*n*m ) );
	} else{
		document.querySelector("#msg").textContent = "You may place your knight.";
	}
}

function transit(){
	update( this.id );
}

function update(id){
	ind = Number( id.substr(1) );
	x = Math.floor(ind / m);
	y = ind % m;
	// console.log( x, y );
	
	if( used[ind] == true ) {
		fail(); return;
	}

	// console.log(prevInd);

	if( prevInd != -1 ){
		px = Math.floor(prevInd / m);
		py = prevInd % m;
		var dx = Math.abs( x-px ), dy = Math.abs( y-py );
		if( Math.min(dx, dy) != 1 || Math.max(dx, dy) != 2 ){
			fail(); return;
		}
	}
	if( prevInd != -1 ){
		document.querySelector( '#c' + prevInd ).style.background = "black";
	}

	score++;
	prevInd = ind;
	node = document.querySelector( '#c'+ind );
	node.style.backgroundColor = "blue";
	used[ind] = 1;

	// Possibility
	for( i = 0 ; i < possibleMoves.length ; i++ ){
		if( document.querySelector( possibleMoves[i] ).style.backgroundColor == "yellow" )
			document.querySelector( possibleMoves[i] ).style.backgroundColor = "";
	}
	possibleMoves = [];

	// Create new ones
	dirx = [1, 2, 1, 2, -1, -2, -1, -2];
	diry = [2, 1, -2, -1, 2, 1, -2, -1];

	for(var i = 0 ; i < 8 ; i++){
		tx = x + dirx[i];
		ty = y + diry[i];

		if( tx >= 0 && ty >= 0 && tx < n && ty < m ){
			tind = '#c' + (tx*m+ty).toString();
			if( document.querySelector( tind ).style.backgroundColor == "" ){
				document.querySelector( tind ).style.backgroundColor = "yellow";
				possibleMoves.push( tind );
			}
		}
	}

	tmp = document.querySelector("#msg");

	if( possibleMoves.length == 0 ){
		if( score == n*m ){
			tmp.innerHTML = "Congratulations! You won the game\n";
		}
		else{
			document.querySelector( '#c'+ind ).style.backgroundColor = "red";
			tmp.innerHTML = "Awww snap! You scored " + score.toString() + ".";
		}
	}
	else{
		tmp.innerHTML = "Keep going!"
	}
}

function fail(){
	tmp = document.querySelector("#msg");
	tmp.innerHTML = "Invalid move.<br>";
}