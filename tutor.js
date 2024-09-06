const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");
// const chatbotToggler=document.querySelector(".chatbot-toggler");
const chatbotCloseBtn=document.querySelector(".close-btn");
let userMessage;
const API_KEY="sk-proj-GD6EulRKFrAV7q4zWS5QT3BlbkFJnDcJKxbSgDMTnRAvdWKd";
const inputInitHeight=chatInput.scrollHeight;
const createChatLi=(message,className)=>{
    const chatLi=document.createElement("li");
    chatLi.classList.add("chat",className);
    let chatContent=className==="outgoing"?`<p></p>`: ` <span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML=chatContent;
    chatLi.querySelector("p").textContent=message;
    return chatLi;
}
const generateResponse=(incomingChatLi)=>{
    const API_URL="https://api.openai.com/v1/chat/completions";
    const messageElement=incomingChatLi.querySelector("p");
    const requestOptions={
        method:"POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model:"gpt-3.5-turbo",
            messages:[{role:"user",content:`Assume you are a home tutor for solving math and science solutions, please answer questions only if they are related to science or math questions only!!!!! Do not answer anything else except for math and science question!!Dont respond with lot of symbols like \,*,etc., make the answer clear to the students  and answer the question if relevant:${userMessage}`}]
        })
    }
    fetch(API_URL,requestOptions).then(res=>res.json()).then(data=>{
        messageElement.textContent=data.choices[0].message.content;
    }).catch((error)=>{
        messageElement.textContent="Oops! Something went wrong. Please try again.";
    }).finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight))
}
const handleChat=()=>{
    userMessage=chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value="";
    chatInput.style.height=`${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage,"outgoing"));
    chatbox.scrollTo(0,chatbox.scrollHeight);
    setTimeout(()=>{
        const incomingChatLi=createChatLi("Thinking...","incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0,chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600)
}

chatInput.addEventListener("input",()=>{
    chatInput.style.height=`${inputInitHeight}px`;
    chatInput.style.height=`${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter" && !e.shiftKey && window.innerWidth>600){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click",handleChat);
// console.log(document.querySelector('body section'));
// chatbotCloseBtn.addEventListener("click",()=>document.querySelector('body section').classList.remove("show-chatbot"));
// chatbotToggler.addEventListener("click",()=>document.querySelector('body section').classList.toggle("show-chatbot"));

let feet    =document.getElementById("feet");
let meter   =document.getElementById("meter");
let inch    =document.getElementById("inches");
let cm      =document.getElementById("cm");
let yard    =document.getElementById("yards");
let km      =document.getElementById("km");
let mile    =document.getElementById("miles");

function feetToOther(val){
    meter.value =  val/3.2808; 
    inch.value =  val*12;   
    cm.value    =  val/0.032808; 
    yard.value  =  val*0.33333;  
    km.value    =  val/3280.8; 
    mile.value  =  val*0.00018939;       
}
function meterToOther(val){
    feet.value = val*3.2808;
    inch.value = val*39.370;  
    cm.value   = val/0.01;
    yard.value = val*1.0936; 
    km.value   = val/1000;
    mile.value = val*0.00062137;
}
function inchesToOther(val){
    feet.value = val*0.083333;
    meter.value = val/39.370;  
    cm.value = val/0.39370;
    yard.value = val*0.027778; 
    km.value = val/39370;
    mile.value = val*0.000015783;
}
function cmToOther(val){
    feet.value = val*0.032808;
    meter.value = val/100;  
    inch.value = val*0.39370;
    yard.value = val*0.010936; 
    km.value = val/100000 ;
    mile.value = val*0.0000062137;
}
function yardsToOther(val){
    feet.value = val*3;
    inch.value = val*36;  
    cm.value = val/0.010936;
    meter.value = val/1.0936; 
    km.value = val/1093.6;
    mile.value = val*0.00056818;
}
function kmToOther(val){
    feet.value = val*3280.8;
    inch.value = val*39370;  
    cm.value = val*100000;
    yard.value = val*1093.6; 
    meter.value = val*1000;
    mile.value = val*0.62137;
}
function milesToOther(val){
    feet.value = val*5280;
    inch.value = val*63360;  
    cm.value = val/0.0000062137;
    yard.value = val*1760; 
    km.value = val/0.62137;
    meter.value = val/0.00062137;

}
// *********************//



function convertToOthers(convertFrom,value){    
    switch(convertFrom){
        case "feet" : feetToOther (parseFloat(value)); break;
        case "meter": meterToOther(parseFloat(value)); break;
        case "inch" : inchesToOther(parseFloat(value)); break;
        case "cm"   : cmToOther(parseFloat(value)); break;
        case "yard" : yardsToOther (parseFloat(value)); break;
        case "km"   : kmToOther (parseFloat(value)); break;
        case "mile" : milesToOther(parseFloat(value)); break;
    }
}
var select = document.querySelectorAll(".currency"),
input_currency = document.getElementById('input_currency'),
output_currency = document.getElementById('output_currency');

fetch(`https://api.frankfurter.app/currencies`)
  .then((data) => data.json())
  .then((data) => {
    const entries = Object.entries(data);
    console.log(data)
	  for (var i = 0; i < entries.length; i++) {
	    select[0].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]}</option>`;
	    select[1].innerHTML += `<option value="${entries[i][0]}">${entries[i][0]}</option>`;
	  }
   	
});

function convert(){
 	input_currency_val = input_currency.value;
 	if(select[0].value != select[1].value ){
 		alert("yes")
 		const host = 'api.frankfurter.app';
		fetch(`https://${host}/latest?amount=${input_currency_val}&from=${select[0].value}&to=${select[1].value}`)
		  .then((val) => val.json())
    	.then((val) => {
		    //alert(`10 GBP = ${data.rates.USD} USD`);
		    output_currency.value = Object.values(val.rates)[0]
		    console.log(Object.values(val.rates)[0])
		});
 	}else{
 		alert("Please select two different currencies")
 	}
}
var screen=document.querySelector('#screen');
    var btn=document.querySelectorAll('.btn');

    /*============ For getting the value of btn, Here we use for loop ============*/
    for(item of btn)
    {
        item.addEventListener('click',(e)=>{
            btntext=e.target.innerText;

            if(btntext =='×')
            {
                btntext= '*';
            }

            if(btntext=='÷')
            {
                btntext='/';
            }
          if(btntext!='x!')  screen.value+=btntext;
        });
    }

    function sin()
    {
        screen.value=Math.sin(screen.value);
    }

    function cos()
    {
        screen.value=Math.cos(screen.value);
    }

    function tan()
    {
        screen.value=Math.tan(screen.value);
    }

    function pow()
    {
        screen.value=Math.pow(screen.value,2);
    }

    function sqrt()
    {
        screen.value=Math.sqrt(screen.value,2);
    }

    function log()
    {
        screen.value=Math.log(screen.value);
    }

    function pi()
    {
        screen.value= 3.14159265359;
    }

    function e()
    {
        screen.value=2.71828182846;
    }

    function fact()
    {
        var i, num, f;
        f=1
        num=screen.value;
        for(i=1; i<=num; i++)
        {
            f=f*i;
        }

        i=i-1;

        screen.value=f;
        console.log(screen.value)
    }

    function backspc()
    {
        screen.value=screen.value.substr(0,screen.value.length-1);
    }