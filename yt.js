import { GoogleGenerativeAI } from "https://unpkg.com/@google/generative-ai?module";
const chatInput=document.querySelector(".chat-input textarea");
const sendChatBtn=document.querySelector(".chat-input span");
const chatbox=document.querySelector(".chatbox");   
        const apiKey = "AIzaSyCd424X4O_x32aOyaMjzlppUKGUb6qk2uQ";
        const genAi = new GoogleGenerativeAI(apiKey);
        const model = genAi.getGenerativeModel({ model: "gemini-pro" });
        let userMessage;
        
        async function generatePoem(userMessage) {
            console.log("In poem")
            console.log(userMessage)
            const result =  await model.generateContent(`
            You are used for responding only with the youtube links i am providing. See the query and based on it give the link of the most similar question/topic I provided you with. Only response with youtube link which I am providing you. You are only expected to respond with a link starting with https only!
            In case you are not getting any topic at all, the return the last youtube link! Dont respond with anything except youtube link.
            The query is: ${userMessage}.
            
            Question or similar queries to the following question:
            Can you provide some tips for managing stress during exams?
            Response: https://www.youtube.com/embed/Bk2-dKH2Ta4?si=dXhzGQ-b8KTZb_Ak
        
            Question or similar queries to the following question:
            How can I recognize signs of anxiety and depression in myself or others?
            Response: https://www.youtube.com/embed/TG4PRIKlYMk?si=sulfgAL2c1gYrRHt
        
            Question or similar queries to the following question:
            What are some effective coping mechanisms for dealing with academic pressure?
            Response: https://www.youtube.com/embed/TG4PRIKlYMk?si=sulfgAL2c1gYrRHt
        
            Question or similar queries to the following question:
            How can I balance academic responsibilities with self-care and social life?
            Response: https://www.youtube.com/embed/9WQwY5BDhnQ?si=pzdJMpX_3_wTUMFV
        
            Question or similar queries to the following question:
            What are some effective study techniques for improving memory retention?
            Response: https://www.youtube.com/embed/niPXuY211ac?si=StRf8bE61x_EyatX
        
            Question or similar queries to the following question:
            How can I stay motivated to study when I'm feeling overwhelmed?
            Response: https://www.youtube.com/embed/xganJryipnM?si=HJW9oYVetKrrfNEE

            Question or similar queries to following question:
            How to maintain consistensy, hardwork and growth?
            Response:https://www.youtube.com/embed/1LGJ4F1_DP4?si=HYsP6IFbfzqNGSDV

            Question or similar queries to following question:
            How to remove distractions?
            Response:https://www.youtube.com/embed/y55bIvC5mYI?si=_1x9Jk4CrfeQRXQ7

            Question or similar queries to following question:
            How to save time?
            Response:https://www.youtube.com/embed/R5i8alK5hPo?si=nwclrPm7rrr16ANt

            Question or similar queries to following question:
            How to study well?
            Response:https://www.youtube.com/embed/TjPFZaMe2yw?si=3gU48IvmGsQFu2eV

            Question or similar queries to following question:
            How to be a successful student?
            Response:https://www.youtube.com/embed/JuYwsNO5XyY?si=87g6pwaSoBOQ_zUM

            Question or similar queries to following question:
            Practical method to manage stress?
            Response:https://www.youtube.com/embed/alWAs9tth9c?si=Ld-wFZMg5wtgwEKQ
        
            Question or similar queries to the following question:
            How can I effectively manage my time to ensure I stay on top of my coursework?
            Response: https://www.youtube.com/embed/iONDebHX9qk?si=VrE43fwiuQLk_KzM
        
            Topics: career, future planning, something related
            Response: https://www.youtube.com/embed/22sZ7c2BRp0?si=lz9VTwE3mlAqIIVu
        `);
            
        
       console.log(result.response.text())
        // https://www.youtube.com/embed/
        const embedUrl = result.response.text();

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.width = '250';
        iframe.height = '200';
        iframe.src = embedUrl;
        // iframe.frameBorder = '0';
        // iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        // Append the iframe to the placeholder div
        // document.getElementsB('chatbot-yt').appendChild(iframe);
        chatbox.appendChild(iframe);
            }

            chatInput.addEventListener("keydown",(e)=>{
                if(e.key==="Enter" && !e.shiftKey && window.innerWidth>600){
                    e.preventDefault();
                    handleCht();
                }
            });
 const handleCht=()=>{
                userMessage=chatInput.value.trim();
                chatInput.value="";
                console.log(userMessage)
                generatePoem(userMessage);
 }
sendChatBtn.addEventListener("click",handleCht);
            // generatePoem();