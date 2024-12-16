


// Create a character set including uppercase, lowercase, digits, and special characters
function createCharacterSet() {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const digits = "0123456789";
    const specialChars = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/";
    return uppercase + lowercase + digits + specialChars;
}

// Find index of a character in the character set
function findIndex(character, characterSet) {
    return characterSet.indexOf(character);
}

// Encrypt the plaintext using the Vigenère cipher
function encrypt(plaintext, key) {
    const characterSet = createCharacterSet();
    const m = characterSet.length;
    const keyLength = key.length;
    let ciphertext = "";

    for (let i = 0; i < plaintext.length; i++) {
        const char = plaintext[i];
        if (characterSet.includes(char)) {
            const P_i = findIndex(char, characterSet);
            const K_i = findIndex(key[i % keyLength], characterSet);
            const C_i = (P_i + K_i) % m;
            ciphertext += characterSet[C_i];
        } else {
            ciphertext += char;
        }
    }
    return ciphertext;
}

// Decrypt the ciphertext using the Vigenère cipher
function decrypt(ciphertext, key) {
    const characterSet = createCharacterSet();
    const m = characterSet.length;
    const keyLength = key.length;
    let plaintext = "";

    for (let i = 0; i < ciphertext.length; i++) {
        const char = ciphertext[i];
        if (characterSet.includes(char)) {
            const C_i = findIndex(char, characterSet);
            const K_i = findIndex(key[i % keyLength], characterSet);
            const P_i = (C_i - K_i + m) % m;
            plaintext += characterSet[P_i];
        } else {
            plaintext += char;
        }
    }
    return plaintext;
}

// Function to decrypt the text and display it
function decryptText(cardNumber) {
    const encryptedText = document.getElementById(`encryptedText${cardNumber}`).value;
    const key = document.getElementById(`key${cardNumber}`).value;
    const outputText = document.getElementById(`outputText${cardNumber}`);

    if (!encryptedText || !key) {
        outputText.textContent = "Please provide both the encrypted text and the key.";
        return;
    }

    const decryptedText = decrypt(encryptedText, key);
    outputText.textContent = `Decrypted Text: ${decryptedText}`;
}

function clearInputs(cardId) {
    const card = document.getElementById(cardId);
    const inputs = card.querySelectorAll('input');
    inputs.forEach(input => {
        input.value = ''; 
    });
}

function scrollToCard2() {
    const card2 = document.getElementById('card2'); 
    if (card2) {
        card2.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.error("Card 2 not found");
    }
}

let completedQuizzes = 0;
const totalQuizzes = 10; // Change this number to the total number of quizzes

function checkAllQuizzesCompleted() {
  completedQuizzes += 1;

  if (completedQuizzes === totalQuizzes) {
    showAllCompletedModal();
    triggerConfetti();  // Trigger confetti animation
  }
}

const canvas = document.getElementById('canvas');


function triggerConfetti() {
    console.log("Confetti triggered");
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) {
        console.error("Canvas element not found");
        return;
    }

    const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
    });

    canvas.style.display = 'block';  // Show canvas
    myConfetti({
        particleCount: 1000,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Hide canvas after animation
    setTimeout(() => {
        canvas.style.display = 'none';
    }, 5000); // Hide after 5 seconds
}

function showAllCompletedModal() {
    document.getElementById("allCompletedModal").classList.remove("hidden");
}

function closeAllCompletedModal() {
    document.getElementById("allCompletedModal").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    const quizButtons = Array.from(document.querySelectorAll("[id^='quizButton']"));

    quizButtons.forEach((button, index) => {
        if (index > 0) {
            button.setAttribute("disabled", "true");
            button.classList.add("opacity-50", "cursor-not-allowed");
        }
    });

    window.submitAnswer = (quizNumber) => {
        const userAnswer = document.getElementById(`userAnswer${quizNumber}`).value.trim().toLowerCase();
        const correctAnswers = {
            1: "cat",
            2: "dog",
            3: "horse",
            4: "tubig",
            5: "dalunggan",
            6: "bull",
            7: "cheetah",
            8: "qoukka",
            9: "capybara",
            10: "vaquita",
        };
    
        if (userAnswer === correctAnswers[quizNumber]) {
            showSuccessModal();
            
            const currentCard = document.getElementById(`card${quizNumber}`);
            if (currentCard) {
                currentCard.style.backgroundImage = `url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="green" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>')`;
                currentCard.style.backgroundSize = "contain";
                currentCard.style.backgroundRepeat = "no-repeat";
                currentCard.style.backgroundPosition = "right";
                currentCard.classList.add("opacity-50");
            }
    
            const currentQuizButton = document.getElementById(`quizButton${quizNumber}`);
            if (currentQuizButton) {
                currentQuizButton.setAttribute("disabled", "true");
                currentQuizButton.classList.add("opacity-50", "cursor-not-allowed");
            }
    
            toggleDescription(`desc${quizNumber}`, `answer${quizNumber}`, `quizButton${quizNumber}`);
            const nextQuizButton = document.getElementById(`quizButton${quizNumber + 1}`);
            if (nextQuizButton) {
                nextQuizButton.removeAttribute("disabled");
                nextQuizButton.classList.remove("opacity-50", "cursor-not-allowed");
            }
    
            // Check if all quizzes are completed
            checkAllQuizzesCompleted();

            clearInputs(`card${quizNumber}`);

        } else {
            showIncorrectModal(); 
        }
    };

    window.showSuccessModal = () => {
        document.getElementById("successModal").classList.remove("hidden");
        setTimeout(closeModal, 2000); 
    };

    window.showIncorrectModal = () => {
        document.getElementById("incorrectModal").classList.remove("hidden");
        setTimeout(closeIncorrectModal, 2000); 
    };

    window.closeModal = () => {
        document.getElementById("successModal").classList.add("hidden");
    };

    window.closeIncorrectModal = () => {
        document.getElementById("incorrectModal").classList.add("hidden");
    };
});

  function toggleDescription(id, answerId, quizButtonId) {
    const description = document.getElementById(id);
    const encryptedKey = document.getElementById(id.replace('desc', 'encryptedKey'));
    const answerContainer = document.getElementById(answerId);
    const quizButton = document.getElementById(quizButtonId);
  
    description.classList.toggle('hidden');
    encryptedKey.classList.toggle('hidden');
    answerContainer.classList.toggle('hidden');
  
    if (description.classList.contains('hidden')) {
      quizButton.textContent = "Take Quiz";
    } else {
      quizButton.textContent = "X";
    }
  }
  
  