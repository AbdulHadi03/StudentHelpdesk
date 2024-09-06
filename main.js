import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { BufferMemory } from "langchain/memory";
import { LLMChain } from "langchain/chains";
import { retriever } from "/utils/retriever";
import { serializeChatHistory } from "/utils/serializeChatHistory";

const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
const toggle=document.querySelector(".toggle");
const toggler=document.querySelector(".toggler");
const togglers=document.querySelector(".togglers");
const togglerss=document.querySelector(".togglerss");
let userMessage;

const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY;

// Used for memory of our chatbot
const memory = new BufferMemory({
  memoryKey: "chatHistory",
  inputKey: "question", // The key for the input to the chain
  outputKey: "text", // The key for the final conversational output of the chain
  returnMessages: true, // If using with a chat model (e.g. gpt-3.5 or gpt-4)
});

// Create prompt templates
const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
  `Given the following chat history (if any) and a follow-up question, rephrase the follow-up question to be a standalone question that was asked by the user.
----------
CHAT HISTORY: {chatHistory}
----------
FOLLOWUP QUESTION: {question}
----------
Standalone question:`
);

const answerPrompt = PromptTemplate.fromTemplate(
  `Assume you are a compassionate and experienced student counselor. 
  If possible, try to summarize key points discussed, highlighting the 
  student's strengths and areas for improvement. Your ultimate goal is to equip students with the tools and skills they need to thrive academically, personally, and socially. Answer the question only if it is related to student life.
----------
CONTEXT: {retrievedContext}
----------
CHAT HISTORY: {chatHistory}
----------
QUESTION: {question}
----------
Helpful Answer:`
);

// Initialize fast and slow LLMs, along with chains for each
const fasterModel = new ChatOpenAI({ openAIApiKey, model: "gpt-4o-2024-05-13" });
const questionChain = new LLMChain({ llm: fasterModel, prompt: standaloneQuestionPrompt });
const answerChain = new LLMChain({ llm: fasterModel, prompt: answerPrompt });

const performQuestionAnswering = async ({ question, retrievedContext, chatHistory }) => {
  const chatHistoryString = chatHistory ? serializeChatHistory(chatHistory) : null;
  
  const { text } = await questionChain.invoke({
    chatHistory: chatHistoryString ?? "",
    question: question,
  });

  const standaloneQuestion = text;
  const serializedContext = formatDocumentsAsString(retrievedContext);
  const response = await answerChain.invoke({
    chatHistory: chatHistoryString ?? "",
    retrievedContext: serializedContext,
    question: standaloneQuestion,
  });

  await memory.saveContext({ question }, { text: response.text });

  return { result: response.text };
};

const chain = RunnableSequence.from([
  {
    question: (input) => input.question,
    chatHistory: async () => {
      const savedMemory = await memory.loadMemoryVariables({});
      const hasHistory = savedMemory.chatHistory.length > 0;
      return hasHistory ? savedMemory.chatHistory : null;
    },
    retrievedContext: async (input) =>
      retriever.getRelevantDocuments(input.question),
  },
  performQuestionAnswering,
]);

const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi;
};

const apiAnswer = async (result, userMessage) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAIApiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-2024-05-13",
      messages: [{
        role: "user",
        content: `Assume you are a compassionate and experienced student counselor. 
         I am providing you the answer from a previous student counselor, use that knowledge first and dont change it and thenuse your own knowledge to give the answer!!
        The previous answer of counselor is: ${result} and The question of the student is as follows: ${userMessage}. Do not mention anything about previous counselor! Also only give answer if it is relavent to student life and mental health`
      }]
    })
  };

  const response = await fetch(API_URL, requestOptions).then(res => res.json());
  return response.choices[0].message.content;
};

const handleChat = async () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;
  // chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  const incomingChatLi = createChatLi("Thinking...", "incoming");
  chatbox.appendChild(incomingChatLi);
  chatbox.scrollTo(0, chatbox.scrollHeight);

  try {
    const input = { question: userMessage };
    const { result } = await chain.invoke(input);
    console.log(result);
    const answer = await apiAnswer(result, userMessage);
    incomingChatLi.querySelector("p").textContent = answer;
  } catch (error) {
    incomingChatLi.querySelector("p").textContent = "Sorry, there was an error processing your request.";
  }
  chatbox.scrollTo(0, chatbox.scrollHeight);
};

chatInput.addEventListener("input", () => {
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 600) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => document.querySelector('body section').classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click", () => document.querySelector('body section').classList.remove("show-chatbot"));
toggle.addEventListener("click",()=>document.querySelector('body section').classList.toggle("show-chatbot"));
toggle.addEventListener("click",()=>{
    let textarea= document.querySelector('.chat-input textarea');
    textarea.innerText="How do I manage time as a student?";
});

toggler.addEventListener("click",()=>document.querySelector('body section').classList.toggle("show-chatbot"));
toggler.addEventListener("click",()=>{
    let textarea= document.querySelector('.chat-input textarea');
    textarea.innerText="How do I manage stress as a student?";
});
togglers.addEventListener("click",()=>document.querySelector('body section').classList.toggle("show-chatbot"));
togglers.addEventListener("click",()=>{
    let textarea= document.querySelector('.chat-input textarea');
    textarea.innerText="Give me some exam writing style tips!";
});
togglerss.addEventListener("click",()=>document.querySelector('body section').classList.toggle("show-chatbot"));
togglerss.addEventListener("click",()=>{
    let textarea= document.querySelector('.chat-input textarea');
    textarea.innerText="Give some career guidance?";
});
