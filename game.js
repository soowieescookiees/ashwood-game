const $=id=>document.getElementById(id);
let state={name:"",neighborGender:"",neighborName:"",clues:[],notes:[],scene:"",memorySeen:false};
const neighborNames={boy:"Evan",girl:"Maya"};
const evidenceData={
  "Memory fragment":"A childhood memory returned at the Halloween party. Someone was with you, but their face is missing from the memory.",
  "Old photograph":"A photograph from years ago shows several Ashwood kids. One face has been scratched away.",
  "Party message":"An anonymous message appeared on your phone: “You came back.”"
};
function show(id){document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));$(id).classList.add("active");}
function toast(msg){$("toast").textContent=msg;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200);}
function addClue(name){if(!state.clues.includes(name)){state.clues.push(name);updateBoard();toast("New clue added: "+name);}}
function addNote(note){if(!state.notes.includes(note)){state.notes.push(note);updateBoard();}}
function updateBoard(){$("clueCount").textContent=`Clues: ${state.clues.length}`;$("boardBtn").disabled=state.clues.length===0;$("evidence").innerHTML=state.clues.map(c=>`<div class="card"><strong>${c}</strong><br>${evidenceData[c]||"Something worth remembering."}</div>`).join("")||"<p class='small'>No evidence collected yet.</p>";$("notebook").innerHTML=state.notes.map(n=>`<div class="card">${n}</div>`).join("")||"<p class='small'>Your notebook is empty.</p>";}
function scene(title,html,buttons=[]){$("sceneText").innerHTML=`<h2>${title}</h2>${html}`;$("choices").innerHTML="";buttons.forEach(b=>{const btn=document.createElement("button");btn.type="button";btn.textContent=b.label;btn.addEventListener("click",b.action);$("choices").appendChild(btn);});show("sceneScreen");}
function startStory(){state.name=$("playerName").value.trim()||"Alex";state.neighborGender=state.neighborGender||"boy";state.neighborName=neighborNames[state.neighborGender];$("objective").textContent="October • Welcome back to Ashwood";scene("WELCOME HOME",`<p>The car turns onto your street as October leaves scrape across the windshield.</p><p>Ashwood looks familiar. Too familiar.</p><p>You pass a decorated school, a row of quiet houses, and a street corner you swear you've seen before.</p><p>Then your house appears.</p>`,[{label:"CONTINUE",action:bedroom}]);}
function bedroom(){scene("THE WINDOW",`<p>Later that night, you unpack in your new bedroom.</p><p>Across the street, another bedroom window glows.</p><p>A teenager is standing there.</p><p>They notice you. After a second, they wave.</p><p>You wave back.</p>`,[{label:"WAVE BACK",action:neighbor},{label:"LOOK AWAY",action:neighbor}]);}
function neighbor(){scene("THE NEIGHBOR",`<p>The next afternoon, someone knocks on your door.</p><p><strong>${state.neighborName}</strong> lives across the street.</p><p>They tell you there is a Halloween party tonight and offer to introduce you to some people from Ashwood.</p>`,[{label:"GO TO THE PARTY",action:party}]);}
function party(){
  $("objective").textContent="Halloween night • The party";
  scene("HALLOWEEN",`<p>The house is crowded with costumes, music, orange lights, and people you haven't seen in years.</p><p>${state.neighborName} introduces you to the group.</p><p>For a while, everything feels normal.</p><p>Then someone mentions that you used to live here.</p><p>Your stomach drops.</p>`,[{label:"ASK WHAT THEY MEAN",action:memory}]);
}
function memory(){state.memorySeen=true;addClue("Memory fragment");addNote("Someone from my childhood was in the memory. I couldn't see their face.");show("memoryScreen");$("memoryText").innerHTML=`<p>You're standing somewhere in Ashwood.</p><p>It's Halloween.</p><p>Someone is beside you.</p><p>You hear their voice, but you can't make out the words.</p><p>You look toward them—</p><p><em>static.</em></p><p>The memory disappears.</p>`;}
function chooseNeighbor(gender,button){state.neighborGender=gender;document.querySelectorAll("#characterScreen .choices button").forEach(b=>b.classList.remove("selected"));button.classList.add("selected");$("continueCharacter").disabled=false;}
$("startBtn").addEventListener("click",()=>show("characterScreen"));
document.querySelectorAll("#characterScreen .choices button").forEach(btn=>btn.addEventListener("click",()=>chooseNeighbor(btn.dataset.gender,btn)));
$("continueCharacter").addEventListener("click",startStory);
$("returnParty").addEventListener("click",()=>{scene("BACK TO THE PARTY",`<p>The music is still playing.</p><p>Nobody seems to have noticed how long you've been gone.</p><p>Then your phone vibrates.</p><p><strong>UNKNOWN NUMBER</strong></p><p>One message:</p><p><em>“You came back.”</em></p>`,[{label:"SAVE THE MESSAGE",action:()=>{addClue("Party message");addNote("An unknown number sent: “You came back.”");partyEnd();}}]);});
function partyEnd(){scene("SOMETHING IS WRONG",`<p>You look across the room.</p><p>For half a second, someone near the window is wearing something that looks like a fencing mask.</p><p>You blink.</p><p>They're gone.</p><p>Was it real?</p>`,[{label:"SEARCH THE ROOM",action:searchParty},{label:"FIND "+state.neighborName,action:searchParty}]);}
function searchParty(){addClue("Old photograph");addNote("A photograph at the party shows Ashwood kids from years ago. One face has been scratched away.");scene("THE PHOTOGRAPH",`<p>You find an old photograph tucked beneath a stack of decorations.</p><p>It shows several kids standing together in front of a house.</p><p>One face has been deliberately scratched out.</p><p>You have the strangest feeling that you know the person.</p>`,[{label:"OPEN CASE FILE",action:()=>show("boardScreen")},{label:"KEEP INVESTIGATING",action:()=>scene("END OF DEMO",`<p>This is the end of the first playable prototype.</p><p>The next build will add the explorable Ashwood neighborhood, characters, clues, the school, and the first chase sequence.</p>`,[{label:"CASE FILE",action:()=>show("boardScreen")}])}]);}
$("boardBtn").addEventListener("click",()=>show("boardScreen"));
$("closeBoard").addEventListener("click",()=>show("sceneScreen"));
updateBoard();
