const extVersion = "1.3";

// Check for updates

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
      <img src="./images/icon.png" class="img-shadow"/>
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
    debugger;
    savedUser = items.username
    if (savedUser) {
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

    getJSON(`https://server.duinocoin.com/users/${username}`).then((data) => {
      if(data.success == true)
      {

        if (remember.checked || savedUser == undefined)
        {
          chrome.storage.local.set({ "username": username }, () => {
            console.log(`User saved successfully -> ${username}`);
          });
        }

        let balance = data["result"]["balance"].balance.toFixed(6);

        document.querySelector(".container").remove();

        let myMiners = [];
        let contentjson = {};
        contentjson = data["result"];
        for (process in contentjson["miners"]) {
          myMiners.push(contentjson["miners"][process]);
        }
        for (miner in myMiners) {
          hashRate = hashRate + myMiners[miner]["hashrate"];
        }

        let newNode = document.createElement("div");
    
        let parentDiv = document.querySelector(".footer").parentNode;
        let sp2 = document.querySelector(".footer");
    
        newNode.classList.add("update");
        newNode.classList.add("container");
        newNode.classList.add("text-center");
    
        newNode.innerHTML = `
          ${getUserImage(username).outerHTML}
          <div class="data">
            <h2>Balance</h2>
            <span>
              ${balance} ᕲ ($ ${(balance * ducoPrice).toFixed(6)})
            </span>
          </div>
          <div class="data">
            <h2>Hashrate</h2>
            <span>
            ${calculateHashrate(hashRate)}
            </span>
          </div>
          <div class="data">
            <h2>Duco Price</h2>
            <span>
            1 ᕲ ≈ $${ducoPrice}
            </span>
          </div>
        `;

        let donateBtn = document.createElement("button");
        donateBtn.innerHTML = "Donate";
        donateBtn.type = "button";
        donateBtn.classList.add("btnMargin");
        donateBtn.onclick = (e) => {
          e.preventDefault();
          document.querySelector(".container").remove();

          let newNode = document.createElement("div");
      
          let parentDiv = document.querySelector(".footer").parentNode;
          let sp2 = document.querySelector(".footer");
      
          newNode.classList.add("update");
          newNode.classList.add("container");
          newNode.classList.add("text-center");
      
          newNode.innerHTML = `
            <div class="data">
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
        }

        newNode.appendChild(donateBtn);
    
        parentDiv.insertBefore(newNode, sp2);

        var checkExist = setInterval(() => {
          if (document.body.contains(document.getElementById("eth"))) {
            document.getElementById("btc").onclick = (e) => 
            {
              e.preventDefault();
              var copyText = document.getElementById("btcI");

              copyText.select();
              copyText.setSelectionRange(0, 99999);
              document.execCommand("copy");
              alert("Copied the text: " + copyText.value);
            };
            document.getElementById("eth").onclick = (e) => 
            {
              e.preventDefault();
              var copyText = document.getElementById("ethI");

              copyText.select();
              copyText.setSelectionRange(0, 99999);
              document.execCommand("copy");
              alert("Copied the text: " + copyText.value);
            };
            clearInterval(checkExist);
          }
        }, 100);
      }
      else 
      {
        document.querySelector(".error").innerHTML = `Error logging-in, please try again`;
        document.querySelector('.container').classList.add("warning");
      }
  });
});

