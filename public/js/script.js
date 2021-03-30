if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

(function(){
  // automatische update van het t-shirt design

  const url = window.location.hash;

  // inputs
  const gender = document.querySelector('#gender');
  const size = document.querySelector('#size');
  const color = document.querySelector('#color');
  const afbeelding = document.querySelector('#afbeelding');
  const uploaded = document.querySelector('.uploaded');
  const updateBtn = document.querySelector('input[value="Update"]');
  const text = document.querySelector('#text');
  const font = document.querySelector('#font');
  const fontColor = document.querySelector('#fontColor');
  const pos = document.querySelector('#pos');
  const textArea = document.querySelector('picture > article');
  const cancel = document.querySelectorAll('.cancel');
  const loginBtn = document.querySelector('label[for="inloggen"]');
  const registerBtn = document.querySelector('label[for="registeren"]');
  const main = document.querySelector('main');

if(url.length === 0){

  // t-shirt
  const tshirt = document.querySelector('img.t-shirt');

  // verberg updateBtn
  updateBtn.style.display = "none";

  // add move button
  const moveTextBtn = document.createElement('button');
  moveTextBtn.innerText = "x";
  pos.insertAdjacentElement('afterend', moveTextBtn)
  moveTextBtn.style.opacity = "0"
  moveTextBtn.classList.add('btn');


  gender.addEventListener('change', (event) => {
    const genderKeuze = event.target.value;
    const shirtKleur = () =>{
      if(color.options[color.selectedIndex].text == "Shirt kleur"){
        return 'wit';
      }else{
        return color.options[color.selectedIndex].text;
      }
    }
    console.log(`De t-shirt kleur is ${shirtKleur()} en het is voor een ${genderKeuze}`)
    tshirt.src = `images/${shirtKleur()}-${genderKeuze}-800.png`;
  })

  color.addEventListener('change', (event) => {
    const colorKeuze = event.target.value;
    const genderKeuze = () => {
      const keuze = gender.options[gender.selectedIndex].text; 
      if(keuze == "Gender"){
        return 'male';
      }else if(keuze.includes('Man')){
        return 'male'
      }else{
        return 'female'
      }
    }
    tshirt.src = `images/${colorKeuze}-${genderKeuze()}-800.png`;
  })


  text.addEventListener('focus', () => {
    font.style.opacity = "1";
    fontColor.style.opacity = "1";
    pos.style.opacity = "1";
    moveTextBtn.style.opacity = "1";
  })

  tshirt.addEventListener('click', () => {
    font.style.opacity = "0";
    fontColor.style.opacity = "0";
    pos.style.opacity = "0";    
    moveTextBtn.style.opacity = "0";  
  })
  
  font.addEventListener('change', ()=> {
    const fontKeuze = event.target.value;
    text.style.fontFamily = fontKeuze;
  })

  fontColor.addEventListener('change', ()=> {
    const fontColorKeuze = event.target.value;
    text.style.color = fontColorKeuze;
  })  

  pos.addEventListener('change', ()=> {
    const pos = event.target.value;
    text.style.fontSize = pos + 'em';
  })  
  
  loginBtn.addEventListener('click', () => {
    const loginForm = document.querySelector('form[action="/inloggen"]');
    if(loginForm.style.opacity == '0'){
      loginForm.style.opacity = "1";
    }else{
      loginForm.style.opacity = "0";
    }
  })

  registerBtn.addEventListener('click', () => {
    const registerForm = document.querySelector('form[action="/register"]');
    console.log(registerForm)
    if(registerForm.style.opacity == "0"){
      registerForm.style.opacity = "1";
    }else{
      registerForm.style.opacity = "0";
    }
  })


  const upload = document.querySelector("#afbeelding");
  upload.addEventListener("change", (e)=>{
    if(window.FileReader){
      const input = event.target;
      const reader = new FileReader();
      reader.onload = () => {
        const dataURL = reader.result;
        const output = document.querySelector(".uploaded");
        output.src = dataURL;
        output.style.width = "50px";
      }
        reader.readAsDataURL(input.files[0]);
    }else{
      main.insertAdjacentHTML('afterbegin',
      `<div>
        <h3>Fotouploaden wordt niet ondersteund</h3>
        <p>Je kunt ons een extra mail sturen met de foto erbij.</p>
      </div>
      `);
    }
  }); 
  
  moveTextBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    font.style.opacity = "0";
    fontColor.style.opacity = "0";
    pos.style.opacity = "0";    
    moveTextBtn.style.opacity = "0";     
  })  

  var dragged;
  /* events fired on the draggable target */
  document.addEventListener("drag", function( event ) {
  }, false);
  document.addEventListener("dragstart", function( event ) {
      // store a ref. on the dragged elem
      dragged = event.target;
      // make it half transparent
      event.target.style.opacity = .5;
  }, false);
  document.addEventListener("dragend", function( event ) {
      // reset the transparency
      event.target.style.opacity = "";
  }, false);
  /* events fired on the drop targets */
  document.addEventListener("dragover", function( event ) {
      // prevent default to allow drop
      event.preventDefault();
  }, false);
  document.addEventListener("dragenter", function( event ) {
      // highlight potential drop target when the draggable element enters it
      if ( event.target.className == "drop" ) {
          
          event.target.style.background = "transparent";
      }
  }, false);
  document.addEventListener("dragleave", function( event ) {
      // reset background of potential drop target when the draggable element leaves it
      if ( event.target.className == "drop" ) {
          event.target.style.background = "";
      }
  }, false);
  document.addEventListener("drop", function( event ) {
      // prevent default action (open as link for some elements)
      event.preventDefault();
      // move dragged elem to the selected drop target
      if ( event.target.className == "drop" ) {
          event.target.style.background = "";
          dragged.parentNode.removeChild( dragged );
          event.target.appendChild( dragged );
      }
    
  }, false);  

  cancel.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('close is clicked')
      const form = event.target.closest('form');
      if(form.style.opacity !== 0){
        form.style.opacity = 0;
      }
    })
  })

  uploaded.addEventListener('click', (event) => {
    const sliderCheck = document.querySelector('input[type="range"]');
    console.log(sliderCheck)
    if(sliderCheck){
      sliderCheck.remove();
    }else{
      const slider = document.createElement('input');
      slider.setAttribute('type', 'range');
      slider.setAttribute('min', '50');
      slider.setAttribute('max', '250');
      event.target.insertAdjacentElement('afterend', slider);
  
      slider.addEventListener('change', (event)=> {
        uploaded.style.width= event.target.value + 'px';
      })
    }
  });

}

})()


