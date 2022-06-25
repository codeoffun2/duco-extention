const extVersion = "1.4";

// Check for updates

const navbar = `
  <div class="navbar">
    <div class="pull-left">
      <img src="../images/icon.png" class="img-shadow"/>
    </div>
    <div class="right">
      <a href="#!" id="donateBtn">
        Donate
      </a>
    </div>
  </div>
`;

getJSON("https://raw.githubusercontent.com/codeoffun2/duco-extention/main/manifest.json").then((data) => {
  let version = data["version"];
  if (version != extVersion) {
    document.querySelector(".container").remove();

    let newNode = document.createElement("div");

    let parentDiv = document.querySelector(".footer").parentNode;
    let sp2 = document.querySelector(".footer");

    newNode.classList.add("update");
    newNode.classList.add("container");
    newNode.classList.add("text-center");

    newNode.innerHTML = `
      ${navbar}
      <img src="../images/icon.png" class="img-shadow"/>
      <h1>Outdated</h1>
      <div class="input-group">
        <p>There is a new version of this extension</p>
        <a href="https://github.com/codeoffun2/duco-extention/" target="_blank"><button type="button">Check</button></a>
      </div>
    `;

    parentDiv.insertBefore(newNode, sp2);
  }
});

let ducoPrice = "0.0";
let hashRate = 0;

let savedUser = undefined;

chrome.storage.local.get(["username"], (items) => {
    savedUser = items.username
    if (savedUser) {
      if(newNode.innerHTML.contains("outdated")) return;
      document.querySelector("#username").value = savedUser;
      document.querySelector('button').click();
    } 
});

getJSON("https://server.duinocoin.com/api.json").then((jsonData) => {
  ducoPrice = jsonData["Duco price"];
  ducoPrice = ducoPrice.toFixed(6);
});

document.querySelector('button').addEventListener("click", () => {
    let username = document.querySelector("#username").value;
    let remember = document.querySelector("#remember");

    getJSON(`https://server.duinocoin.com/v3/users/${username}`).then((data) => {
      if(data.success == true)
      {

        if (remember.checked || savedUser == undefined)
        {
          chrome.storage.local.set({ "username": username }, () => {
            console.log(`User saved successfully -> ${username}`);
          });
        }

        let balance = data["result"]["balance"].balance.toFixed(4);

        document.querySelector(".container").remove();

        let myMiners = [];
        let contentjson = {};
        let transactions = [];
        contentjson = data["result"];

        for (trx in contentjson["transactions"]) {
          transactions.push(contentjson["transactions"][trx]);
        }

        transactions.reverse();

        for (process in contentjson["miners"]) {
          myMiners.push(contentjson["miners"][process]);
        }

        for (miner in myMiners) {
          hashRate = hashRate + myMiners[miner]["hashrate"];
        }

        let newNode = document.createElement("div");
    
        let parentDiv = document.querySelector(".footer").parentNode;
        let sp2 = document.querySelector(".footer");
    
        let transactionsHTML = '';

        newNode.classList.add("update");
        newNode.classList.add("container");
        newNode.classList.add("text-center");

        for (trx in transactions) {
          let transaction = transactions[trx];
          let negative = false;

          if(transaction.recipient == username) negative = false;
          else negative = true;

          transactionsHTML += `
            <a class="transaction" target="_blank" href="https://explorer.duinocoin.com/?search=${transaction.hash}">
              <div class="pull-left">
                ${getUserImage(negative ? transaction.recipient : transaction.sender).outerHTML}
              </div>
              <div class="pull-right is-column">
                <div class="is-flex amount ${negative ? "red" : "green"}">${negative ? '-' : '+'}${transaction.amount}</div>
                <div class="is-flex">${transaction.datetime}</div>
              </div>
            </a>
          `;
        }

        newNode.innerHTML = `
          ${navbar}
          <div class="profile text-left">
            <div class="profile-cont">
              <div class="pull-left">
                ${getUserImage(username).outerHTML}
              </div>
              <div class="content">
                <h2>${username}</h2>
              </div>
            </div>
            <div class="profile-footer">
              <span class="pull-left">
                ${balance} ᕲ<br/>
                ${(balance * ducoPrice).toFixed(2)} USD
              </span>
              <span class="pull-right">
                1 ᕲ ≈ $${ducoPrice}
              </span>
            </div>
          </div>
          <div class="transactions">
            ${transactionsHTML}
          </div>
        `;
    
        parentDiv.insertBefore(newNode, sp2);

        let donateBtn = document.getElementById('donateBtn');
        donateBtn.addEventListener('click', (e) => {
          e.preventDefault();
          document.querySelector(".container").remove();

          let newNode = document.createElement("div");

          let parentDiv = document.querySelector(".footer").parentNode;
          let sp2 = document.querySelector(".footer");

          newNode.classList.add("update");
          newNode.classList.add("container");
          newNode.classList.add("text-center");

          newNode.innerHTML = `
            ${navbar}
            <div class="btnMargin">
              <h2>Donate to Me</h2>
              <span>
                Duco Username:<br/>
                codeoffun<br/>
            </div>
            <a href="https://duinocoin.com/donate" target="_blank">
              <button type="button" class="data">
                Donate to revox and his team
              </button>
            </a>
          `;

          parentDiv.insertBefore(newNode, sp2);
        });

      }
      else 
      {
        document.querySelector(".error").innerHTML = `Error logging-in, please try again`;
        document.querySelector('.container').classList.add("warning");
      }
  });
});