const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

const OPENAI_API_KEY = "YOUR-OPENAI-API-KEY-HERE";
let isImageGenerating = false;

const updatedImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".img-card") [index];
        const imgElement = imgCard.querySelector("img");
        const downloadBtn = imgCard.querySelector(".downlaod-btn");

        // image source set to the AI-generated image data
        const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedImage;
        
        // remove loading class and set downlaod attributes when the image is loaded
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
            downloadBtn.setAttribute("href", aiGeneratedImage);
            downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
        }
    });
}

const generateAiImages = async (userPrompt, userPrompt, userImgQuantity) => {
    try {
        // send a request to the OpenAI API to generate images based on user inputs
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                prompt: userPrompt,
                n: userImgQuantity,
                size: "512*512",
                response_format: "b64_json"
            }),
        });

        // Throw an error message if the API response is unsuccessful
        if(!response.ok) throw new Error("Failed to generate AI images. Make sure your API key is valid.");
         const { data } = await response.json(); //get data from response
         updatedImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
        isImageGenerating = false;
    }
}

const handleImageGeneration = (e) => {
    e.preventDefault();
    if(isImageGenerating) return;

    // get user input and image quantity values
    const userPrompt = e.srcElement[0].value;
    const userImgQuantity = parseInt(e.srcElement[1].value);

    // Disable the generate button, upadate its text, and set the flag
    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating";
    isImageGenerating = true;

    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({ lenght: userImgQuantity }, () =>
    `<div class="img-card loading">
    <img src="images/loader.svg" alt="AI generated image">
    <a class="download-btn" href="#">
      <img src="images/download.svg" alt="downlaod icon">
      </a>
      </div>`
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);