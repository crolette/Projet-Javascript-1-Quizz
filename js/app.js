let questions = [
    {
        question: "Quelle est la capitale de la Belgique?",
        reponses: ["Paris", "Berlin", "Bruxelles", "Rome"],
        good: "Bruxelles"
    },
    {
        question: "Quelle est la capitale de la France?",
        reponses: ["Berlin", "Bruxelles", "Paris", "Rome"],
        good: "Paris"
    },
    {
        question: "Quelle est la capitale de l'Allemagne?",
        reponses: ["Bruxelles", "Berlin", "Paris", "Rome"],
        good: "Berlin"
    },
    {
        question: "Quelle est la capitale de l'Italie?",
        reponses: ["Rome", "Berlin", "Bruxelles", "Paris"],
        good: "Rome"
    },
    {
        question: "Quelle est la capitale du Rwanda?",
        reponses: ["Kigali", "Kampala", "Kinshasa", "Kuala Lumpur"],
        good: "Kigali"
    },
    {
        question: "Quelle est la capitale de l'Estonie?",
        reponses: ["Riga", "Tallinn", "Helsinki", "Prague"],
        good: "Tallinn"
    },
    {
        question: "Quelle est la capitale du Chili?",
        reponses: ["Kigali", "Kampala", "Santiago", "Kuala Lumpur"],
        good: "Santiago"
    }
]


let bonnesReponses = 0;
const choix = ['A', 'B', 'C', 'D']


/* CREATION DES QUESTIONS SUR LA PAGE */ 
const formNbQuestions = document.querySelector(".nb__questions")
const nbQuestionsInput = document.querySelector("#nbQuestions")
let nbQuestionsQuizz = 0;


formNbQuestions.addEventListener('submit', (e) => {
    // on form submission, prevent default
    e.preventDefault();
    deleteForm();

    /* Variable qui va contenir les numéros des questions à ajouter au quizz */ 
    let questionsNrQuizz = []

    console.log("send form nb question")

    nbQuestionsQuizz = nbQuestionsInput.value;
    console.log(nbQuestionsQuizz);
    
    for (let i = 1; i <= nbQuestionsQuizz; i++) {
        console.log("addQuestionNr : " + i)
        addQuestionNr(questionsNrQuizz)        
    }

    addQuestionToQuizz(questionsNrQuizz)
});


/* Fonction qui ajoute à un tableau les numéros de question au hasard */ 
const addQuestionNr = (questionsNrQuizz) => {
    let nr = Math.floor(Math.random() * questions.length)
    if (questionsNrQuizz.includes(nr)) {
        addQuestionNr(questionsNrQuizz)
    } else {
        questionsNrQuizz.push(nr)
    }
}


/* Supprimer le formulaire si il existe déjà */
const deleteForm = () => {
    document.querySelector(".form__questions") ? document.querySelector(".form__questions").remove() : console.log("form n'existe pas")
}


const addQuestionToQuizz = (questionsNrQuizz) => {

    let formQuestions = document.createElement("form")
    formQuestions.classList.add("form__questions")

    for (let i = 0; i < questionsNrQuizz.length; i++) {
        let nrQuestion = questionsNrQuizz[i]

        /* Création de la div avec la question */
        let newQuestionDiv = document.createElement("div")
        newQuestionDiv.classList.add("question")

        /* Création du titre de la question */
        let questionLabel = document.createElement("h2")
        questionLabel.classList.add("question__label")
        questionLabel.innerText = questions[nrQuestion].question
        questionLabel.setAttribute("id", i)
        newQuestionDiv.append(questionLabel)

        /* Creation de la div contenant toutes les réponses */
        let newAnswers = document.createElement("div")
        newAnswers.classList.add("answers")    

        for (let j = 0; j <= 3; j++) {
            /* Creation de la div contenant une réponse */
            let newAnswer = document.createElement("div")
            newAnswer.classList.add("answer")
            
            /*/ Creation de l'input radio avec le choix de réponse */ 
            let answerInput = document.createElement("input")
            answerInput.setAttribute("type", "radio")
            answerInput.setAttribute("value", questions[nrQuestion].reponses[j])
            answerInput.setAttribute("name", nrQuestion)
            answerInput.setAttribute("id", `q${nrQuestion}-${choix[j]}`)
            newAnswer.append(answerInput)

            let answerLabel = document.createElement("label")
            answerLabel.setAttribute("for", `q${nrQuestion}-${choix[j]}`)
            answerLabel.innerText = questions[nrQuestion].reponses[j]
            newAnswer.append(answerLabel)

            newAnswers.append(newAnswer)
        }

    newQuestionDiv.append(newAnswers)
    formQuestions.append(newQuestionDiv)
    }

    let sendFormButton = document.createElement("button")
    sendFormButton.classList.add("send__form")
    sendFormButton.innerText = "Envoyer"
    formQuestions.append(sendFormButton)

    formNbQuestions.after(formQuestions)

    /* Ajoute l'eventListener après la création du formulaire et des questions */
    addEventForm();
}

/* On récupère les divs avec les questions sur la page */
const addEventForm = () => {
    
    const formQuestions = document.querySelector(".form__questions")
    
    formQuestions.addEventListener('submit', (e) => {
      // on form submission, prevent default
      e.preventDefault();
    
      // construct a FormData object, which fires the formdata event
      new FormData(formQuestions);
    });    

    

    // formdata handler to retrieve data
    formQuestions.addEventListener('formdata', (e) => {
        // Get the form data from the event object
        let data = e.formData;

        /* initialisation index pour parcourir les questions du formulaire */
        let index = 0
    
        bonnesReponses = 0
        
        for (let value of data.entries()) {
            verifierReponses(value, index)
            index++
        }
    
        for (let value of data.values()) {
            console.log("valeur " + value)
        }
    
        addScore(index);
    })
}


/* VALIDATION DES REPONSES */
const verifierReponses = (data, index) => {
    let indexQuestion = data[0]
    let reponse = data[1]
    data[1] === questions[indexQuestion].good ? addState(index, "good", "error") : addState(index, "error", "good")
}


/* Fonction qui ajoute une classe error + animation si la réponse est mauvaise */
const addState = (index, stateIn, stateOut) => {
    const questionsForm = document.querySelectorAll(".question")

    if (questionsForm[index].classList.contains(stateOut)) {
        questionsForm[index].classList.remove(stateOut)
    }
    questionsForm[index].classList.add(stateIn)

    if(stateIn === "error") {
        /* Animation de la question quand erreur */
        questionsForm[index].animate([
        {transform: 'translateX(-2px)'},
        {transform: 'translateX(2px)'},
        {transform: 'translateX(-2px)'},
        {transform: 'translateX(2px)'}
    ], 200)
    } else {
        bonnesReponses++
    }
}


/* Fonction qui ajoute le score au DOM après avoir soumis le formulaire */
const addScore = (index) => {
    const formQuestions = document.querySelector(".form__questions")
    const nbQuestions = formQuestions.querySelectorAll(".question")
    const score = document.querySelector("#score")
    const resultat = document.querySelector(".resultat")
    resultat.classList.remove("is-hidden")
    const resultatTitle = document.querySelector(".resultat__title")

    score.innerText = `Nombre de bonnes réponses : ${bonnesReponses} \\ ${index}`

    if (bonnesReponses === nbQuestions.length) {
        formQuestions.classList.add("good")
        resultatTitle.innerText = "BRAVOOO"
     } else {
        resultatTitle.innerText = "Résultat"
        formQuestions.classList.remove("good")
     }
}

/* AJOUT NOUVELLE QUESTION */ 
const formAddQuestions = document.querySelector(".add__questions")
const formAddQuestionsTitle = document.querySelector(".question__title")

/* Ouverture du tab pour ajouter la question */
formAddQuestionsTitle.addEventListener('click', (e) => {
    const addQuestionTab = formAddQuestions.querySelector(".answers")
    const imgOpen = document.querySelector(".tab__img--open")
    const imgClose = document.querySelector(".tab__img--close")

    if(addQuestionTab.classList.contains("is-hidden")) {
        addQuestionTab.classList.remove("is-hidden")
        imgOpen.classList.add("is-hidden")
        imgClose.classList.remove("is-hidden")
    } else {
        addQuestionTab.classList.add("is-hidden")
        imgOpen.classList.remove("is-hidden")
        imgClose.classList.add("is-hidden")
    } 
})

formAddQuestions.addEventListener('submit', (e) => {
  // on form submission, prevent default
  e.preventDefault();

  // construct a FormData object, which fires the formdata event
  new FormData(formAddQuestions);
  formAddQuestions.reset();
});


// formdata pour récupérer les données de la nouvelle question
formAddQuestions.addEventListener('formdata', (e) => {

    // Get the form data from the event object
    let data = e.formData;
  
    const q = {
        question: "",
        reponses: [],
        good: ""
    }
    
    for (let value of data.entries()) {
        if (value[0] === "question") {
            q.question = value[1]
        } else if (value[0] === "good") {
            q.good = value[1]
            q.reponses.push(value[1])
        } else if (value[0] === "reponse") {
            q.reponses.push(value[1])
        }
    }

    questions.push(q)
})