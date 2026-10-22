const protagonistChoices=document.querySelectorAll('#protagonistChoices button');
const neighborChoices=document.querySelectorAll('#neighborChoices button');
const continueButton=document.getElementById('continueCharacter');

state.protagonistGender='';
state.neighborGender='';

function refreshCharacterContinue(){
  continueButton.disabled=!(state.protagonistGender && state.neighborGender);
}

function selectGroup(buttons, selected){
  buttons.forEach(b=>b.classList.remove('selected'));
  selected.classList.add('selected');
}

protagonistChoices.forEach(button=>{
  const clean=button.cloneNode(true);
  button.replaceWith(clean);
});
neighborChoices.forEach(button=>{
  const clean=button.cloneNode(true);
  button.replaceWith(clean);
});

const newProtagonistChoices=document.querySelectorAll('#protagonistChoices button');
const newNeighborChoices=document.querySelectorAll('#neighborChoices button');

newProtagonistChoices.forEach(button=>button.addEventListener('click',()=>{
  state.protagonistGender=button.dataset.gender;
  selectGroup(newProtagonistChoices,button);
  refreshCharacterContinue();
}));

newNeighborChoices.forEach(button=>button.addEventListener('click',()=>{
  state.neighborGender=button.dataset.gender;
  selectGroup(newNeighborChoices,button);
  refreshCharacterContinue();
}));

refreshCharacterContinue();
