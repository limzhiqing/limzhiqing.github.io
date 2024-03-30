// Define an empty array to store quiz questions
var questions = [];

/**
 * Validates form inputs and fetches quiz data if inputs are valid.
 */
function validateAndFetch() {
    // Retrieve values from the form inputs
    var topic = document.getElementById("topic").value.trim();
    var num_qns = parseInt(document.getElementById("num_qns").value.trim());
    var difficulty = document.getElementById("difficulty").value.trim();
    var language = document.getElementById("language").value.trim();

    // Flag to track form validity
    var isValid = true;

    // Validate number of questions input
    if (!(num_qns >= 1 && num_qns <= 10)) {
        isValid = false;
        document.getElementById("numQnsError").classList.remove("d-none");
    } else {
        document.getElementById("numQnsError").classList.add("d-none");
    }

    // Validate topic input
    if (topic === '') {
        isValid = false;
        document.getElementById("topicError").classList.remove("d-none");
    } else {
        document.getElementById("topicError").classList.add("d-none");
    }

    // Validate difficulty input
    if (difficulty === '') {
        isValid = false;
        document.getElementById("difficultyError").classList.remove("d-none");
    } else {
        document.getElementById("difficultyError").classList.add("d-none");
    }

    // Validate language input
    if (language === '') {
        document.getElementById("languageError").classList.remove("d-none");
        isValid = false;
    } else {
        document.getElementById("languageError").classList.add("d-none");
    }

    // If form inputs are valid, fetch quiz data
    if (isValid) {
        var url = `https://quiz-generator-yzv6qqjrra-uc.a.run.app/?topic=${topic}&num_qns=${num_qns}&difficulty=${difficulty}&language=${language}`;
        fetch(url)
            .then(response => {
                // Check if network response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Log quiz data and display quiz
                console.log(data);
                questions = data
                generateQuiz();
                alert("Quiz generated successfully!");
            })
            .catch(error => {
                // Log any errors that occur during fetch
                console.error('Error:', error);
            });
    }
}

/**
 * Generates a quiz based on the provided questions.
 */
function generateQuiz(){
    // Get the container element where the quiz will be displayed
    var quizContainer = document.getElementById('quizContainer');

    // Initialize an empty array to store the HTML output for each question
	var output = [];

    // Loop through each question in the questions array
	for(var i=0; i<questions.length; i++){
        // Initialize an empty array to store the HTML options for the current question
		var options = [];

        // Loop through each option in the options object of the current question
		for(letter in questions[i].options){
            // Generate HTML markup for each option
            options.push(
                '<div class="form-check">'
                    + '<input class="form-check-input" type="radio" name="question' + i + '" id="question' + i + letter + '" value="' + letter + '">'
                    + '<label class="form-check-label" for="question' + i + letter + '">'
                        + letter + ': ' + questions[i].options[letter]
                    + '</label>'
                + '</div>'
            );
		}

        // Generate HTML markup for the current question and its options, and push it to the output array
        output.push(
            '<div class="card my-4">'
                + '<div class="card-body">'
                    + '<h5 class="card-title">Question ' + (i + 1) + ':</h5>'
                    + '<p class="card-text">' + questions[i].question + '</p>'
                    + '<div class="options">' + options.join('') + '</div>'
                + '</div>'
            + '</div>'
        );
	}

    // Set the inner HTML of the quiz container to the generated output, joining all elements with an empty string
	quizContainer.innerHTML = output.join('');

    // Make the submit button visible after generating the quiz
    document.getElementById("submitButton").classList.remove("d-none");
}

function showResults() {
    var quizContainer = document.getElementById('quizContainer');
    var resultsContainer = document.getElementById('resultsContainer');

    var numCorrect = 0;

    for (var i = 0; i < questions.length; i++) {
        var selectedOption = quizContainer.querySelector('input[name=question' + i + ']:checked');

        if (selectedOption) {
            var options = quizContainer.querySelectorAll('input[name=question' + i + ']');
            options.forEach(function(option) {
                option.nextElementSibling.style.color = '';
            });

            var selectedValue = selectedOption.value;
            var correctAnswer = questions[i].answer;

            if (selectedValue === correctAnswer) {
                numCorrect++;
                selectedOption.nextElementSibling.style.color = 'lawngreen';
            } else {
                selectedOption.nextElementSibling.style.color = 'red';
            }
        }
    }

    resultsContainer.style.textAlign = 'center';
    resultsContainer.innerHTML = numCorrect + ' out of ' + questions.length;
}