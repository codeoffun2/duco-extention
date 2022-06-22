const bal = document.getElementById( 'bal' );

fetch(`https://server.duinocoin.com/balances/${username}`);
  then( response => {
    return response.json();
  })
  then( data => {
    bal.textContent = JSON.stringify( data.result.balance );
  })
 