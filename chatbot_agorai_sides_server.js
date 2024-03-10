let thread_id = null; // Global variable to store the thread ID

document.addEventListener('DOMContentLoaded', function () {
    const inputField = document.querySelector('.message_input_user');
    const sendButton = document.querySelector('.send_button');
    const messageContainer = document.querySelector('.message_container');
    const recommendedPromptsContainer = document.querySelector('.recommended_prompt_container');
    const recommendedPrompts = document.querySelectorAll('.recommended_prompt');
    const gotoclassicbutton = document.querySelector('.go_to_classic_button');
    const gotoclassictooltip = document.querySelector('.go_to_classic_tooltip');

    gotoclassicbutton.addEventListener('click', function(){
        window.location.href = 'https://savia-demo2.myshopify.com/collections/all'
    })

    setTimeout(() => {
        gotoclassictooltip.classList.add('visible');
        setTimeout(() => {
            gotoclassictooltip.classList.remove('visible');
        }, 3000)
    }, 3000)

    inputField.addEventListener('keydown', function(event){
        if (event.key === "Enter" || event.keycode === 13) {
            event.preventDefault();
            sendButton.click();
        }
    })

    sendButton.addEventListener('click', async function () {
        const userMessage = inputField.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user_message');
            inputField.value = ''; // Clear the input field
            recommendedPromptsContainer.style.visibility = 'hidden'; // Hide recommended prompts
            messageContainer.style.display = 'flex' 
            displayLoadingIndicator(); // Display loading indicator

            try {
                const botResponse = await getBotResponse(userMessage); // Wait for the bot response
                displayMessage(botResponse, 'bot_message');
            } catch (error) {
                console.error('Error fetching bot response:', error);
                displayMessage("Sorry, there was an error processing your request.", 'bot_message');
            } finally {
                removeLoadingIndicator(); // Remove loading indicator after displaying bot response
                displayNPSContent();
            }
        }
    });

    recommendedPrompts.forEach(prompt => {
        prompt.addEventListener('click', function () {
            inputField.value = prompt.textContent; // Set prompt text to input field
            sendButton.click(); // Trigger send button click
        });
    });

    function displayMessage(message, className) {
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('wrapper_message');

        // Create image wrapper
        const imgWrapperDiv = document.createElement('div');
        imgWrapperDiv.classList.add('message_img_wrapper');

        // Create image circle
        const imgCircleDiv = document.createElement('div');
        imgCircleDiv.classList.add(className === 'user_message' ? 'user_img_circle' : 'bot_img_circle');

        // Create image element
        const imgElement = document.createElement('img');
        imgElement.src = className === 'user_message' ? 'https://github.com/Mega61/sample_web_app/blob/master/Icon%20awesome-user-alt-color2.png?raw=true' : 'https://github.com/Mega61/sample_web_app/blob/master/agorAI_logo_alternate_color.png?raw=true';
        imgElement.alt = className === 'user_message' ? 'You' : 'Bot';

        // Append image circle and image to image wrapper
        imgWrapperDiv.appendChild(imgCircleDiv);
        imgWrapperDiv.appendChild(imgElement);

        // Create message div
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(className);
        messageDiv.innerHTML = message;

        // Append image wrapper and message to wrapper
        wrapperDiv.appendChild(imgWrapperDiv);
        wrapperDiv.appendChild(messageDiv);

        // Append wrapper to message container
        messageContainer.appendChild(wrapperDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    async function getBotResponse(userMessage) {
        let url;
        let data;

        if (!thread_id) {
            // First message
            url = 'https://gpt-integrator-serbsyawbq-uc.a.run.app/agorai_assistant';
            data = { user_message: userMessage };
        } else {
            // Continuing conversation
            url = 'https://gpt-integrator-serbsyawbq-uc.a.run.app/agorai_assistant_continue';
            data = { user_message: userMessage, thread_id: thread_id };
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            if (!thread_id) {
                thread_id = responseData.thread_id; // Store the thread ID for future messages
            }

            return responseData.bot_response; // Assuming the response contains a 'bot_response' field
        } catch (error) {
            console.error('Error fetching bot response:', error);
            return "Sorry, there was an error processing your request.";
        }
    }

    function scrollToFeaturedProducts() {
        const featuredProductsSection = document.getElementById('featured_products');
        if (featuredProductsSection) {
            setTimeout(() => {
                featuredProductsSection.scrollIntoView({ behavior: 'smooth' });
            }, 2000); // Delay in milliseconds (1000ms = 1 second)
        }
    }

    function displayLoadingIndicator() {
        // Similar structure as displayMessage but for loading indicator
        const wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('wrapper_message');

        const imgWrapperDiv = document.createElement('div');
        imgWrapperDiv.classList.add('message_img_wrapper');

        const imgCircleDiv = document.createElement('div');
        imgCircleDiv.classList.add('bot_img_circle');

        const imgElement = document.createElement('img');
        imgElement.src = 'https://github.com/Mega61/sample_web_app/blob/master/agorAI_logo_alternate_color.png?raw=true';
        imgElement.alt = 'Bot';

        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('loading_indicator');
        loadingDiv.innerHTML = '<span class="loading_dots">...</span>';

        imgWrapperDiv.appendChild(imgCircleDiv);
        imgWrapperDiv.appendChild(imgElement);
        wrapperDiv.appendChild(imgWrapperDiv);
        wrapperDiv.appendChild(loadingDiv);

        // Hide NPS content
        const npsContainer = document.querySelector('.nps_container');
        if (npsContainer) {
            npsContainer.style.display = 'none';
        }

        messageContainer.appendChild(wrapperDiv);
        scrollToBottom();
    }

    function removeLoadingIndicator() {
        const loadingDivs = document.querySelectorAll('.loading_indicator');
        if (loadingDivs.length > 0) {
            // Assuming the last loading indicator is the one to be removed
            const lastLoadingDiv = loadingDivs[loadingDivs.length - 1];
            if (lastLoadingDiv && lastLoadingDiv.parentElement) {
                lastLoadingDiv.parentElement.remove();
            }
        }
    }

    function displayNPSContent() {
        const npsContainer = document.querySelector('.nps_container');
        npsContainer.style.display = 'flex';
    }


});
