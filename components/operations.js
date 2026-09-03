/* Operations cards: classified files with redacted text -> reveal on hover */
(function(){
  const FILES = [
    {
      id:"OP-0x041",
      name:"OPERATION: GHOST HANDSHAKE",
      tags:["CLASS-IV","WET","ACTIVE"],
      stamp:"CLASSIFIED",
      kind:"infiltration",
      where:"FRA-3",
      when:"2031.03.07",
      brief:"Quiet infiltration of an unnamed clearinghouse. Targets traded packets under cover of a routine NTP sync. We replaced the time.",
      pieces:[
        "Asset",
        ["████████ ███████","an analyst named M."],
        "took routine breaks at",
        ["██:██","09:42"],
        ". We owned the coffee machine. Everything downstream was inevitable."
      ]
    },
    {
      id:"OP-0x059",
      name:"OPERATION: DEAD CHANNEL",
      tags:["CLASS-II","COLD","COMPLETE"],
      stamp:"BURN AFTER",
      kind:"signals",
      where:"PAC-RIM",
      when:"2030.11.22",
      brief:"A national broadcaster ran twelve minutes of static. Inside the static: forty-one kilobytes of opcode. Tuned receivers heard the new gospel.",
      pieces:[
        "Frequency",
        ["███.███ MHz","104.713 MHz"],
        "carried our second voice. Civilians reported their televisions",
        ["████████","dreaming"],
        "."
      ]
    },
    {
      id:"OP-0x07C",
      name:"OPERATION: HOLLOW SPINE",
      tags:["CLASS-V","DEEP","RECURRING"],
      stamp:"EYES ONLY",
      kind:"supply chain",
      where:"NA-CORR",
      when:"2031.01.14",
      brief:"A logistics platform shipped fourteen million packages. One percent of those packages, by mass, were ours. None of them were ever opened by their addressees.",
      pieces:[
        "Inserted",
        ["████ kg","148 kg"],
        "of hardware across",
        ["██ countries","11 countries"],
        ". Customs cleared every gram."
      ]
    },
    {
      id:"OP-0x0A1",
      name:"OPERATION: MIRROR LUNG",
      tags:["CLASS-III","ACTIVE"],
      stamp:"NEED TO KNOW",
      kind:"social",
      where:"global",
      when:"ongoing",
      brief:"For ninety-one days we breathed in the public sphere. Trending topics arrived in the morning and left at dusk on schedule. Nobody noticed the metronome.",
      pieces:[
        "Reach",
        ["█.█B users","2.4B users"],
        "/ measured drift",
        ["+██.█%","+18.6%"],
        ". No fingerprints because we wore everyone's."
      ]
    },
    {
      id:"OP-0x0D3",
      name:"OPERATION: KIND ARSON",
      tags:["CLASS-II","CLOSED"],
      stamp:"RECONCILED",
      kind:"financial",
      where:"EU-CORE",
      when:"2030.06.30",
      brief:"A fund laundered detention budgets through three shells and a cheese cooperative. We made the cheese cooperative whole and the rest go missing.",
      pieces:[
        "Recovered",
        ["€███ M","€217 M"],
        "redistributed to",
        ["█████ households","12,401 households"],
        ". The cheese was very good."
      ]
    },
    {
      id:"OP-0x0F8",
      name:"OPERATION: PATIENT ZERO",
      tags:["CLASS-V","STANDBY"],
      stamp:"DO NOT EXECUTE",
      kind:"kill switch",
      where:"—",
      when:"—",
      brief:"A single packet, hand-rolled, addressed to a name nobody alive uses. It sits in our outbox. It will not be sent until the room is empty.",
      pieces:[
        "Payload",
        ["█ byte","1 byte"],
        ". Effect",
        ["████████████████","total cessation"],
        ". The packet is patient. So are we."
      ]
    },
  ];

  const grid = document.getElementById("opsGrid");
  if(!grid) return;

  function renderPieces(parts){
    return parts.map(p=>{
      if(Array.isArray(p)){
        const [redacted, real] = p;
        return `<span class="redacted">${redacted}</span><span class="real">${real}</span>`;
      }
      return p;
    }).join(" ");
  }

  FILES.forEach((f,i)=>{
    const el = document.createElement("article");
    el.className = "ops-card";
    el.innerHTML = `
      <div class="head">
        <span>// FILE ${f.id}</span>
        <span class="stamp">${f.stamp}</span>
      </div>
      <div class="code">${f.tags.map(t=>"["+t+"]").join("  ")}</div>
      <h3>${f.name}</h3>
      <div class="meta">
        <span>kind <b>${f.kind}</b></span>
        <span>region <b>${f.where}</b></span>
        <span>ts <b>${f.when}</b></span>
      </div>
      <div class="body">
        <p style="margin-bottom:10px; color:#cfd;">${f.brief}</p>
        <p>${renderPieces(f.pieces)}</p>
      </div>
      <div class="footrow">
        <span>signed · 0x${(Math.random()*0xFFFFFFFF|0).toString(16).toUpperCase().padStart(8,"0")}</span>
        <span class="open">[ hover :: decrypt ]</span>
      </div>
    `;
    grid.appendChild(el);
  });
})();
