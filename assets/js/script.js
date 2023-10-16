const url="https://api.dictionaryapi.dev/api/v2/entries/en/";
const input= document.getElementById("word-input")
const form=document.querySelector('.form')
const contenerWord = document.querySelector('.results-word')
const soundButton = document.querySelector('.results-sound')
const resultList = document.querySelector('.results-list')
const resultWrapper = document.querySelector('.results')
const errorContainer = document.querySelector('.error')

let state={
    word:"",
    meanings:[],
    phonetics:[]
}

const showError=(error)=>{
    errorContainer.style.display='block'
    resultWrapper.style.display='none'
    errorContainer.innerText=error.message
}

const showResults=()=>{
    errorContainer.style.display='none'
    resultWrapper.style.display='block';
    resultList.innerHTML="";
    state.meanings.forEach((item)=>resultList.innerHTML+=renderItem(item));
}

const renderDefinition=(itemDefinition)=>{
    const example = itemDefinition.example?
    `<div class="results-item__example"><p>Example: <span>${itemDefinition.example}</span></p></div>`
    :""

    return`
        <div class="results-item__definition">
            <p>${itemDefinition.definition}</p>
            ${example}
        </div>`
}

const getDefinition =(definitions)=>{
    return definitions.map(renderDefinition).join("");
}

const renderItem=(item)=>{
    const itemDefinition=item.definitions[0]
    return`<div class="results-item">
    <div class="results-item__part">${item.partOfSpeech}</div>
    <div class="results-item__definitions">
      ${getDefinition(item.definitions)}
    </div>
  </div>`
}

const insertWord=()=>{
    contenerWord.innerHTML=state.word;
}

const handelSubmit= async (e) =>{
    e.preventDefault();

    if(!state.word.trim()) return;

    try{
        const response = await fetch(`${url}${state.word}`);
        const data= await response.json();

        if(response.ok && data.length){
            const item=data[0];
            state={
            ...state,
            meanings:item.meanings,
            phonetics: item.phonetics}
            insertWord();
            showResults();
        }
        else{
            showError(data);
        }
    }catch (err){
        console.log(err);
    }
}

const handelKeyup=(e)=>{
    const value=e.target.value;
    state.word=value
}

const handelSound =()=>{
    if(state.phonetics.length){
        const sound = state.phonetics[0];
        if(sound.audio){
            new Audio(sound.audio).play();
        }
    }
}

//EVENTS
input.addEventListener('keyup', handelKeyup)
form.addEventListener('submit', handelSubmit)
soundButton.addEventListener('click', handelSound)